import { cn } from "@/helpers/utils"
import { Outlet } from "react-router-dom"
import FadeInUp from "../animation/FadeInUp"
import Thumbnail from "@/assets/images/hero.png"

const AuthLayout = () => {
  return (
    <div className="flex h-screen font-inter justify-around">
      <div
        className={cn(
          "w-full lg:w-1/2 flex flex-col justify-center items-center"
        )}
      >
        <div className="w-full max-w-xs m-4">
          <FadeInUp>
            <Outlet />
          </FadeInUp>
        </div>
      </div>
      <div
        className={cn(
          "hidden w-1/2 lg:flex items-center justify-center bg-gradient-to-r from-red-400 via-orange-300 to-yellow-300"
        )}
      >
        <img className="w-96 mx-auto my-auto" src={Thumbnail} />
      </div>
    </div>
  )
}

export default AuthLayout
