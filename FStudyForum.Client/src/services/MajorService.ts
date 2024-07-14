import api from "./api"
import { ResponseWith } from "@/types/response"

const getAll = async () => {
  const response = await api.get<ResponseWith<Array<string>>>("/forum/major")
  return response.data.data
}

const MajorService = {
  getAll
}

export default MajorService
