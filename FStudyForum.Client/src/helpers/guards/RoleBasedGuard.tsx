import NoPremission from "@/components/NoPremission"
import { useAuth } from "@/hooks/useAuth"
import { FC, ReactNode } from "react"

export interface RoleBasedGuardProps {
  accessibleRoles: Array<string>
  children: ReactNode
}

const RoleBasedGuard: FC<RoleBasedGuardProps> = ({
  children,
  accessibleRoles
}) => {
  const { user } = useAuth()
  const isRoleMatched =
    user?.roles.some(r => accessibleRoles.includes(r)) ?? false
  if (!isRoleMatched) return <NoPremission />
  return <>{children}</>
}

export default RoleBasedGuard
