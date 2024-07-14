import { motion } from "framer-motion"
import { FC, PropsWithChildren } from "react"
import { useLocation } from "react-router-dom"

const FadeInUp: FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation()
  return (
    <motion.div
      key={location.key}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.75 }}
    >
      {children}
    </motion.div>
  )
}

export default FadeInUp
