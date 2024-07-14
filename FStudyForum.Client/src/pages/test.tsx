import useSignalR from "@/hooks/useSignalR";
import { SendHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

const Test = () => {
  const { on, off, sendMessage } = useSignalR();
  const [receive, setReceive] = useState("");
  const [message, setMessage] = useState("");

  const send = () => {
    sendMessage("SendMessage", message);
  };
  useEffect(() => {
    const handleMessage = (message: string) => {
      setReceive(message);
    };

    on("ReceiveMessage", handleMessage);
    return () => off("ReceiveMessage", handleMessage);
  }, [on, off]);
  return (
    <>
      <div className="flex items-center gap-x-2">
        <span>Send: </span>{" "}
        <input
          type="text"
          className="border-2 px-2"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button className="border-2 p-1" type="button" onClick={send}>
          <SendHorizontal className="w-4 h-4" />
        </button>
      </div>
      <div>
        <span>Receive: {receive}</span>
      </div>
    </>
  );
};

export default Test;
