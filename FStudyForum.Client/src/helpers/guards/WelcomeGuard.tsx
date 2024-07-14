import { FC, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const WelcomeGuard: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();
  if (Boolean(user?.avatar) == false) return <Navigate to={"/welcome"} />;

  return <>{children}</>;
};

export default WelcomeGuard;
