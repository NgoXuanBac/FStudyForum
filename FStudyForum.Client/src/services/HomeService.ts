import api from "./api"
import { Response } from "@/types/response"

const helloworld = async () => {
  const response = await api.get<Response>("/test/helloworld")
  return response.data.message.toString()
}

const HomeService = {
  helloworld
}

export default HomeService
