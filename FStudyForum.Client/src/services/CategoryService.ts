

import { ResponseWith } from "@/types/response";
import api from "./api";
import { Category, CreateCategoryDTO, UpdateCategoryDTO } from "@/types/category";

const getAllCategory = async (type?: string): Promise<Category[]> => {
  const response = await api.get<ResponseWith<Category[]>>(
    type ? `/category/all?type=${type}` : "/category/all"
  );
  return response.data.data;
};

const create = async (category: CreateCategoryDTO): Promise<Category> => {
  const response = await api.post<Category>("/category/create", category);
  return response.data;
};

const update = async (name: string, category: UpdateCategoryDTO): Promise<Category> => {
  const response = await api.put<Category>(`/category/update/${name}`, category);
  return response.data;
};

const deleteCategory = async (name: string): Promise<void> => {
  await api.delete(`/category/delete/${name}`);
};

const filterCategoriesByType = async (type: string): Promise<Category[]> => {
  const response = await api.get<ResponseWith<Category[]>>(`/category/filter`, { params: { type } });
  return response.data.data;
};

const CategoryService = {
  getAllCategory,
  create,
  update,
  deleteCategory,
  filterCategoriesByType
};

export default CategoryService;
