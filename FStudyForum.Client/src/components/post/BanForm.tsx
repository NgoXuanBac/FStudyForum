import React, { useState } from "react";
import { Radio } from "@material-tailwind/react";
import { LockKeyhole } from "lucide-react";
import { AxiosError } from "axios";
import { Response } from "@/types/response";
import { Post } from "@/types/post";
import { cn } from "@/helpers/utils";
import { showErrorToast, showSuccessToast } from "@/helpers/toast";
import TopicService from "@/services/TopicService";

type BanUserProps = {
  post: Post;
  handler: () => void;
};

const BanForm: React.FC<BanUserProps> = ({ post, handler }) => {
  const [selectedTime, setSelectedTime] = useState("1 day");

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(event.target.value);
  };

  const handleBan = () => {
    const topicBan = async () => {
      const [time, action] = selectedTime.split(" ");
      try {
        const response = await TopicService.banUser({
          username: post.author,
          topicName: post.topicName,
          action: action,
          time: Number(time)
        });
        showSuccessToast(response.message);
        handler();
      } catch (e) {
        const error = e as AxiosError<Response>;
        showErrorToast(
          (error?.response?.data as Response)?.message || error.message
        );
      }
    };
    topicBan();
  };

  const LockedMenuItem = [
    { value: "1 hour", label: "1 hour" },
    { value: "1 day", label: "1 day" },
    { value: "1 month", label: "1 month" },
    { value: "1 year", label: "1 year" },
    { value: "1000 forever", label: "Forever" }
  ];

  return (
    <>
      <div
        className={cn(
          "flex items-center p-4 font-sans text-2xl antialiased font-semibold leading-snug shrink-0 text-blue-gray-900"
        )}
      >
        Ban user
      </div>
      <div
        className={cn(
          "relative p-4 font-sans text-base antialiased font-light leading-relaxed border-t border-b border-t-blue-gray-100 border-b-blue-gray-100 text-blue-gray-500"
        )}
      >
        <div>
          <div className={cn("flex gap-[2%]")}>
            <div className={cn("font-semibold text-black")}>Username:</div>
            <div className={cn("font-semibold text-black")}>{post.author}</div>
          </div>
          <div className={cn("flex gap-[2%] mt-[2%]")}>
            <div className={cn("font-semibold text-black")}>Topic:</div>
            <div className={cn("font-semibold text-black")}>
              {post.topicName}
            </div>
          </div>
          <div>
            <div>
              <div className="flex mt-[2%]">
                <div className={cn("font-semibold text-black")}>Locked:</div>
                <div className={cn("mt-[-1.4%]")}>
                  {LockedMenuItem.map(({ value, label }, key) => (
                    <Radio
                      key={key}
                      name="type"
                      value={value}
                      label={label}
                      crossOrigin={undefined}
                      className="time font-semibold text-black"
                      onChange={handleTimeChange}
                      checked={selectedTime === value}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "flex flex-wrap items-center justify-end p-4 shrink-0 text-blue-gray-500"
        )}
      >
        <button
          data-ripple-dark="true"
          data-dialog-close="true"
          className={cn(
            "px-6 py-3 mr-1 font-sans text-xs font-semibold text-red-500 uppercase transition-all rounded-lg middle none center hover:bg-red-500/10 active:bg-red-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          )}
          onClick={handler}
        >
          Cancel
        </button>
        <button
          data-ripple-light="true"
          data-dialog-close="true"
          className={cn(
            "middle none center rounded-lg bg-gradient-to-tr from-orange-600 to-orange-400 py-3 px-6 font-sans text-xs font-semibold uppercase text-white shadow-md shadow-orange-500/20 transition-all hover:shadow-lg hover:shadow-orange-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          )}
          onClick={handleBan}
        >
          <LockKeyhole />
        </button>
      </div>
    </>
  );
};

export default BanForm;
