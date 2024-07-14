import { CircleAlert, X } from "lucide-react";
import { FC } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/helpers/utils";
import { useMutation } from "@tanstack/react-query";
import FeedService from "@/services/FeedService";
import { AxiosError } from "axios";
import { showErrorToast } from "@/helpers/toast";
import { Response } from "@/types/response";

type Props = {
  handler: () => void;
};
const validation = Yup.object({
  name: Yup.string()
    .required("Title is required")
    .min(3, "Title must be longer than 3 characters")
    .max(128, "Title must be shorter than 128 characters")
});
interface FeedSubmit {
  name: string;
  description?: string;
}

const CreateFeedForm: FC<Props> = ({ handler }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FeedSubmit>({
    resolver: yupResolver(validation)
  });

  const { mutate: handleCreate } = useMutation({
    mutationFn: async (data: FeedSubmit) =>
      FeedService.createFeed({
        name: data.name,
        description: data.description ?? ""
      }),
    onSuccess: () => {
      console.log("create feed successfully");
      handler();
    },
    onError: e => {
      const error = e as AxiosError<Response>;
      showErrorToast(
        (error?.response?.data as Response)?.message || error.message
      );
      handler();
    }
  });

  return (
    <div className="relative p-2 ">
      <h1 className="font-semibold text-center text-md">Create custom feed</h1>
      <button
        type="button"
        className="absolute p-1 bg-blue-gray-700/50 rounded-full right-0 top-0"
        onClick={handler}
      >
        <X className="text-white w-4 h-4" />
      </button>

      <form
        onSubmit={handleSubmit(data => handleCreate(data))}
        className="flex flex-col gap-y-4"
      >
        <div className="text-blue-gray-800">
          <p className="font-medium text-sm">Name</p>
          <input
            type="text"
            placeholder="Name"
            className="bg-blue-gray-50 py-3 px-4 rounded-xl w-full border-none focus:outline-none"
            {...register("name")}
          />
          {errors.name && (
            <span
              className={cn(
                "text-red-500 text-xs ml-1 mb-1 flex gap-x-1 items-center"
              )}
            >
              <CircleAlert className="w-3 h-3" /> {errors.name.message}
            </span>
          )}
        </div>
        <div className="text-blue-gray-800">
          <p className="font-medium text-sm">Description (optional)</p>
          <TextareaAutosize
            placeholder="Description"
            className={cn(
              "w-full appearance-none overflow-hidden bg-blue-gray-50 rounded-xl",
              "focus:outline-none py-3 px-4"
            )}
            {...register("description")}
          />
          {errors.description && (
            <span
              className={cn(
                "text-red-500 text-xs ml-1 mb-1 flex gap-x-1 items-center"
              )}
            >
              <CircleAlert className="w-3 h-3" /> {errors.description.message}
            </span>
          )}
        </div>
        <div className="flex gap-x-2 justify-end text-blue-gray-800">
          <button
            type="button"
            className="bg-blue-gray-100 p-2 rounded-full text-sm font-medium"
            onClick={handler}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-full text-sm font-medium"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateFeedForm;
