import { AuthContext } from "@/contexts/auth/AuthContext"
import { useContext } from "react"

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("Auth context must be inside AuthProvide")
  return context
}
