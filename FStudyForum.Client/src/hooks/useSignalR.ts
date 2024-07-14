import { SignalRContext } from "@/contexts/signalR/SignalRContext";
import { useContext } from "react";

const useSignalR = () => {
  const context = useContext(SignalRContext);
  if (context === undefined) {
    throw new Error("useSignalR must be used within a SignalRProvider");
  }
  return context;
};

export default useSignalR;
