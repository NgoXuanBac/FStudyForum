import React, { useState, useEffect } from 'react';
import { Alert, Chip, Input } from '@material-tailwind/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { ChevronLeft, ChevronRight, X, XCircle } from 'lucide-react';
import { Category } from '@/types/category';
import TopicService from '@/services/TopicService';
import CategoryService from '@/services/CategoryService';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/helpers/storage'; 
import axios, { AxiosError } from 'axios';
import { TopicType } from '@/types/topic';
interface UpdateTopicPopupProps {
  open: boolean;
  topic: TopicType;
  onClose: () => void;
  onUpdate: () => void;
}

interface FormInputs {
  topicName: string;
  description: string;
  avatar?: string;
  banner?: string;
}

const validationSchema = Yup.object().shape({
  topicName: Yup.string()
    .trim()
    .required('Topic name is required')
    .max(50, 'Topic name must be no more than 50 characters'),
  description: Yup.string().trim().required('Description is required'),
  avatar: Yup.string().optional(),
  banner: Yup.string().optional(),
});

const UpdateTopicPopup: React.FC<UpdateTopicPopupProps> = ({ open, topic, onClose, onUpdate }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(topic.avatar || null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(topic.banner || null);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    mode: 'onTouched',
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const fetchedCategories = await CategoryService.getAllCategory();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to fetch categories. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setIsLastStep(activeStep === 2);
    setIsFirstStep(activeStep === 0);
  }, [activeStep]);

  useEffect(() => {
    setValue('topicName', topic.name);
    setValue('description', topic.description);
    setValue('avatar', topic.avatar || '');
    setValue('banner', topic.banner || '');
    setSelectedCategories(topic.categories);
  }, [topic, setValue]);

  const handleNext = async () => {
    let isValid = false;
    switch (activeStep) {
      case 0:
        isValid = await trigger(['topicName', 'description']);
        break;
      case 1:
        isValid = true; 
        break;
      case 2:
        isValid = true;
        break;
      default:
        isValid = true;
        break;
    }
    if (isValid) {
      nextStep();
    }
  };

  const handleUpdateTopic = async (data: FormInputs) => {
    try {
      setLoading(true);
      const updatedTopic = {
        name: data.topicName,
        description: data.description,
        avatar: data.avatar || '',
        banner: data.banner || '',
        categories: selectedCategories,
      };
      await TopicService.update(topic.name, updatedTopic);
      onUpdate();
      onClose();
    } catch (error: unknown) {
      console.error('Error updating topic:', error);
      if (axios.isAxiosError(error)) {
        const apiError = error as AxiosError<{ message: string }>;
        setError(apiError.response?.data?.message || 'Failed to update topic');
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Unknown error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(categoryId)
        ? prevCategories.filter((id) => id !== categoryId)
        : [...prevCategories, categoryId]
    );
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    field: 'avatar' | 'banner'
  ) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;

    const storageRef = ref(storage, `uploads/${field}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      () => {},
      (error) => {
        console.error('Upload error:', error);
        setError('Failed to upload image. Please try again.');
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        if (field === 'avatar') {
          setAvatarPreview(downloadURL);
          setValue('avatar', downloadURL);
        } else if (field === 'banner') {
          setBannerPreview(downloadURL);
          setValue('banner', downloadURL);
        }
      }
    );
  };

  const handleRemoveImage = async (field: 'avatar' | 'banner') => {
    try {
      let currentImageURL = '';
      if (field === 'avatar') {
        currentImageURL = avatarPreview || '';
        setAvatarPreview(null);
        setValue('avatar', '');
      } else if (field === 'banner') {
        currentImageURL = bannerPreview || '';
        setBannerPreview(null);
        setValue('banner', '');
      }
  
      if (currentImageURL) {
        const storageRef = ref(storage, currentImageURL);
        await deleteObject(storageRef);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      setError('Failed to delete image. Please try again.');
    }
  };
  const nextStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const renderStep = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div>
            <div className="mb-4">
              <Input
                crossOrigin={undefined} type="text"
                label="Topic Name"
                {...register('topicName')}
                error={!!errors.topicName}              />
              {errors.topicName && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.topicName.message}
                </span>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Enter description"
                className="border border-gray-300 rounded px-2 py-1 w-full h-36 resize-none"
                {...register('description')}
              ></textarea>
              {errors.description && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </span>
              )}
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Avatar
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleFileChange(event, 'avatar')}
                className="mt-2"
              />
              {avatarPreview && (
                <div className="mt-2 flex items-center">
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="h-16 w-16 object-cover rounded-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage('avatar')}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              )}
              {errors.avatar && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.avatar.message}
                </span>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Banner
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleFileChange(event, 'banner')}
                className="mt-2"
              />
              {bannerPreview && (
                <div className="mt-2 flex items-center">
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="h-32 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage('banner')}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              )}
              {errors.banner && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.banner.message}
                </span>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="mb-6">
            <p className="text-xl font-semibold">Select Categories</p>
            <p className="text-xs text-gray-600 text-left">
              Choose categories that fit your topic
            </p>
            <div className="overflow-x-auto max-h-[20rem]">
              <div className="mt-6 w-full flex flex-wrap gap-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className="hover:cursor-pointer"
                  >
                    <Chip
                      color="blue-gray"
                      variant={
                        selectedCategories.includes(category.id)
                          ? 'filled'
                          : 'ghost'
                      }
                      value={category.name}
                      className="rounded-full capitalize"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className={`fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 flex justify-center items-center ${open ? 'block' : 'hidden'}`}>
      <form
        className="bg-white p-8 rounded-md w-96 relative"
        onSubmit={handleSubmit(handleUpdateTopic)}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-xl font-bold mb-4">Update Topic</h2>
        {error && (
          <Alert color="red" className="mb-4">
            {error}
          </Alert>
        )}
        <div className="mb-4">{renderStep(activeStep)}</div>
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => {
              !loading && prevStep();
            }}
            className={`flex gap-x-2 text-deep-orange-400 hover:cursor-pointer select-none font-bold ${
              isFirstStep ? 'text-orange-100' : ''
            }`}
          >
            <ChevronLeft /> Back
          </button>
          <button
            type={isLastStep ? 'submit' : 'button'}
            onClick={() => {
              !loading && (isLastStep ? handleSubmit(handleUpdateTopic)() : handleNext());
            }}
            className="flex gap-x-2 text-deep-orange-400 hover:cursor-pointer select-none font-bold"
          >
            {!isLastStep ? 'Next' : 'Finish'}
            <ChevronRight />
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateTopicPopup;
