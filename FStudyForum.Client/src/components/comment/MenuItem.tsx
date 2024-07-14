import React from "react";
import { Ban, Ellipsis, LockKeyhole, Edit, Trash } from "lucide-react";
import {
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
  Radio
} from "@material-tailwind/react";
import { cn } from "@/helpers/utils";
import { Comment } from "@/types/comment";
import { useAuth } from "@/hooks/useAuth";
import { Response } from "@/types/response";
import { AxiosError } from "axios";
import TopicService from "@/services/TopicService";
import { showErrorToast, showSuccessToast } from "@/helpers/toast";
import { Roles } from "@/helpers/constants";

type MenuItemCommentProps = {
  comment: Comment;
  onDelete: (id: string) => Promise<void>;
  onEdit: (commentId: number, content: string) => void;
};

const MenuItemComment: React.FC<MenuItemCommentProps> = ({
  comment,
  onDelete,
  onEdit
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [selectedTime, setSelectedTime] = React.useState("1 day");

  const { user } = useAuth();

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(event.target.value);
  };

  const handleBan = () => {
    const topicBan = async () => {
      const [time, action] = selectedTime.split(" ");
      try {
        const response = await TopicService.banUser({
          username: comment.author,
          topicName: comment.topicName,
          action: action,
          time: Number(time)
        });
        showSuccessToast(response.message);
      } catch (e) {
        const error = e as AxiosError<Response>;
        showErrorToast(
          (error?.response?.data as Response)?.message || error.message
        );
      }
    };
    topicBan();
  };
  const TimeBanMenu = [
    { value: "1 hour", label: "1 hour" },
    { value: "1 day", label: "1 day" },
    { value: "1 month", label: "1 month" },
    { value: "1 year", label: "1 year" },
    { value: "1000 forever", label: "Forever" }
  ];

  const CommentMenuItem = () => {
    const isAdmin = user?.roles.includes(Roles.ADMIN);

    if (comment.author === user?.username) {
      return [
        { icon: Edit, label: "Edit", path: "edit" },
        { icon: Trash, label: "Delete", path: "delete" }
      ];
    } else if (isAdmin) {
      return [
        { icon: Ban, label: "Ban", path: "ban" },
        { icon: Trash, label: "Delete", path: "delete" }
      ];
    } else {
      return [];
    }
  };

  return (
    <>
      {comment.author === user?.username ||
      user?.roles.includes(Roles.ADMIN) ? (
        <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
          <MenuHandler>
            <Button
              variant="text"
              color="blue-gray"
              className="flex items-center rounded-full p-2 text-black"
            >
              <Ellipsis className="w-4 h-4" strokeWidth={1.4} />
            </Button>
          </MenuHandler>
          <MenuList className="p-1">
            {CommentMenuItem().map(({ label, icon, path }, key) => {
              const isLastItem = key === CommentMenuItem().length - 1;
              return (
                <MenuItem
                  key={label}
                  onClick={
                    path === "edit"
                      ? () => onEdit(comment.id, comment.content)
                      : path === "delete"
                      ? () => onDelete(comment.id.toString())
                      : path === "ban"
                      ? () => setIsModalOpen(true)
                      : () => {}
                  }
                  className={`flex items-center gap-2 rounded ${
                    isLastItem &&
                    "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                  }`}
                >
                  {React.createElement(icon, {
                    className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                    strokeWidth: 2
                  })}
                  <Typography
                    as={"span"}
                    className={cn(
                      "font-normal text-sm",
                      isLastItem ? "text-red-500" : "inherit"
                    )}
                  >
                    {label}
                  </Typography>
                </MenuItem>
              );
            })}
          </MenuList>
        </Menu>
      ) : null}
      {isModalOpen && (
        <div
          data-dialog-backdrop="dialog"
          data-dialog-backdrop-close="true"
          className={cn(
            "fixed inset-0 z-[999] grid h-screen",
            "w-screen place-items-center",
            "bg-black bg-opacity-60 opacity-100 backdrop-blur-sm",
            "transition-opacity duration-300"
          )}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            data-dialog="dialog"
            className={cn(
              "relative m-4 w-2/5 min-w-[50%] max-w-[70%]",
              "rounded-lg bg-white font-sans text-base font-light",
              "leading-relaxed text-blue-gray-500",
              "antialiased shadow-2xl"
            )}
            onClick={e => e.stopPropagation()}
          >
            <div
              className={cn(
                "flex items-center p-4 font-sans text-2xl",
                "antialiased font-semibold leading-snug",
                "shrink-0 text-blue-gray-900"
              )}
            >
              Ban user
            </div>
            <div
              className={cn(
                "relative p-4 font-sans text-base antialiased",
                "font-light leading-relaxed border-t border-b",
                "border-t-blue-gray-100 border-b-blue-gray-100 text-blue-gray-500"
              )}
            >
              <div>
                <div className={cn("flex gap-[2%]")}>
                  <div className={cn("font-semibold text-black")}>
                    Username:
                  </div>
                  <div className={cn("font-semibold text-black")}>
                    {comment.author}
                  </div>
                </div>
                <div className={cn("flex gap-[2%] mt-[2%]")}>
                  <div className={cn("font-semibold text-black")}>Topic:</div>
                  <div className={cn("font-semibold text-black")}>
                    {comment.topicName}
                  </div>
                </div>
                <div>
                  <div>
                    <div className="flex mt-[2%]">
                      <div className={cn("font-semibold text-black")}>
                        Time:
                      </div>
                      <div className={cn("mt-[-1.4%]")}>
                        {TimeBanMenu.map(({ value, label }, key) => (
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
                "flex flex-wrap items-center",
                "justify-end p-4 shrink-0 text-blue-gray-500"
              )}
            >
              <button
                data-ripple-dark="true"
                data-dialog-close="true"
                className={cn(
                  "px-6 py-3 mr-1 font-sans text-xs font-semibold",
                  "text-red-500 uppercase transition-all rounded-lg middle none",
                  "center hover:bg-red-500/10 active:bg-red-500/30",
                  "disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                )}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                data-ripple-light="true"
                data-dialog-close="true"
                className={cn(
                  "middle none center rounded-lg bg-gradient-to-tr",
                  "from-orange-600 to-orange-400 py-3 px-6 font-sans",
                  "text-xs font-semibold uppercase text-white shadow-md",
                  "shadow-orange-500/20 transition-all hover:shadow-lg",
                  "hover:shadow-orange-500/40 active:opacity-[0.85]",
                  "disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                )}
                onClick={() => {
                  setIsModalOpen(false), handleBan();
                }}
              >
                <LockKeyhole />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuItemComment;
