import { signOut } from "@/contexts/auth/reduce"
import { useAuth } from "@/hooks/useAuth"
import AuthService from "@/services/AuthService"
import React, { FC } from "react"
import { useNavigate } from "react-router-dom"

const SignOut: FC = () => {
  const { dispatch } = useAuth()
  const navigate = useNavigate()

  React.useEffect(() => {
    const signout = async () => {
      await AuthService.logout()
      dispatch(signOut())
    }
    signout()
    navigate("/auth/signin")
  }, [navigate, dispatch])

  return <></>
}
export default SignOut
