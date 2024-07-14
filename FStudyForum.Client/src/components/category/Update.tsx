import React, { useState, useEffect } from "react";
import {
  Alert,
  DialogBody,
  DialogFooter,
  Button
} from "@material-tailwind/react";
import { UpdateCategoryDTO, Category } from "@/types/category";
import CategoryService from "@/services/CategoryService";
import CategoryTypeService from "@/services/CategoryTypeService";

interface UpdateCategoryPopupProps {
  open: boolean;
  category: Category;
  onClose: () => void;
  onUpdate: () => void;
}

const UpdateCategoryPopup: React.FC<UpdateCategoryPopupProps> = ({
  open,
  category,
  onClose,
  onUpdate
}) => {
  const [categoryName, setCategoryName] = useState(category.name);
  const [description, setDescription] = useState(category.description);
  const [type, setType] = useState(category.type);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [categoryTypes, setCategoryTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const types = await CategoryTypeService.getAll();
        setCategoryTypes(types);
      } catch (error) {
        console.error("Error fetching category types:", error);
      }
    };

    fetchData();
  }, [category]);

  const handleUpdateCategory = async () => {
    try {
      const updatedCategory: UpdateCategoryDTO = {
        name: categoryName,
        description,
        type
      };
      await CategoryService.update(category.name, updatedCategory);
      setSuccessMessage("Category updated successfully!");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating category:", error);
      setError("Error updating category. Please try again later.");
    }
  };

  useEffect(() => {
    if (open) {
      setCategoryName(category.name);
      setDescription(category.description);
      setType(category.type);
      setError(null);
    }
  }, [open, category]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50 ${
        open ? "block" : "hidden"
      }`}
    >
      <div className="bg-white rounded-md p-4 shadow-lg w-80">
        <DialogBody>
          <h2 className="text-xl text-black font-semibold mb-4">
            Update Category
          </h2>
          {error && (
            <Alert color="red" className="mb-4">
              {error}
            </Alert>
          )}
          {successMessage && (
            <Alert color="green" className="mb-4">
              {successMessage}
            </Alert>
          )}
          <div className="mb-4">
            <label
              htmlFor="categoryName"
              className="block font-semibold mb-1 text-black"
            >
              Category Name:
            </label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={e => setCategoryName(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 w-full text-black"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block font-semibold mb-1 text-black"
            >
              Description:
            </label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 w-full h-24 resize-none text-black"
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="type"
              className="block font-semibold mb-1 text-black"
            >
              Type:
            </label>
            <select
              id="type"
              value={type}
              onChange={e => setType(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 w-full text-black"
            >
              <option value={type}>{type}</option>
              {categoryTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end space-x-2">
          <Button
            onClick={handleUpdateCategory}
            color="blue"
            ripple={true}
            className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md focus:outline-none"
          >
            Update
          </Button>
          <Button
            onClick={onClose}
            color="gray"
            ripple={true}
            className="text-gray-700 bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md focus:outline-none"
          >
            Cancel
          </Button>
        </DialogFooter>
      </div>
    </div>
  );
};

export default UpdateCategoryPopup;
