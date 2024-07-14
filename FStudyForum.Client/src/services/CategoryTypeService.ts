import api from "./api"
import { ResponseWith } from "@/types/response"

const getAll = async () => {
  const response = await api.get<ResponseWith<Array<string>>>("/forum/categoryType")
  return response.data.data
}

const CategoryTypeService = {
  getAll
}

export default CategoryTypeService;
