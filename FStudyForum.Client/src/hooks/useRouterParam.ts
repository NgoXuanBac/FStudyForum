import { RouterParamContext } from "@/contexts/router/RouterParamContext";
import { useContext } from "react";

const useRouterParams = () => {
  const context = useContext(RouterParamContext);
  if (!context)
    throw new Error("Router params context must be inside RouterPramsProvide");
  return context;
};
export { useRouterParams as useRouterParam };
