import { Post } from "@/types/post";
import {
  Avatar,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography
} from "@material-tailwind/react";
import { Ellipsis, Images, RotateCcw, Trash2 } from "lucide-react";
import { Response } from "@/types/response";

import DefaultTopic from "@/assets/images/topic.png";
import DefaultUser from "@/assets/images/user.png";

import ImageWithLoading from "../ui/ImageWithLoading";
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/helpers/utils";
import PostService from "@/services/PostService";
import { showErrorToast, showSuccessToast } from "@/helpers/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface Props {
  data: Post;
}
const TrashPost: React.FC<Props> = ({ data }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const { mutate: handleRestoreFromTrash } = useMutation({
    mutationFn: PostService.restoreFromTrash,
    onSuccess: message => {
      queryClient.invalidateQueries({
        queryKey: ["POST_LIST"],
        refetchType: "all"
      });
      showSuccessToast(message);
    },
    onError: e => {
      const error = e as AxiosError<Response>;
      showErrorToast(
        (error?.response?.data as Response)?.message || error.message
      );
    }
  });

  const { mutate: handleDelete } = useMutation({
    mutationFn: PostService.deleteForever,
    onSuccess: message => {
      queryClient.invalidateQueries({
        queryKey: ["POST_LIST"],
        refetchType: "all"
      });
      showSuccessToast(message);
    },
    onError: e => {
      const error = e as AxiosError<Response>;
      showErrorToast(
        (error?.response?.data as Response)?.message || error.message
      );
    }
  });

  const menuItem = [
    {
      icon: RotateCcw,
      label: "Restore from trash",
      handle: () => handleRestoreFromTrash(data.id)
    },
    {
      icon: Trash2,
      label: "Delete forever",
      handle: () => handleDelete(data.id)
    }
  ];

  return (
    <div className="flex p-2 relative">
      <div className="flex flex-col gap-y-2 grow justify-between w-3/5">
        <div className="action">
          <div className="text-xs font-light flex items-center justify-between gap-x-2">
            <div className="flex items-center">
              {data.topicName ? (
                <Link
                  to={`/topic/${data.topicName}`}
                  className="text-xs font-light hover:underline flex items-center gap-x-2"
                >
                  <Avatar
                    src={data.topicAvatar || DefaultTopic}
                    className="w-6 h-6"
                  />
                  {`t/${data.topicName}`}
                </Link>
              ) : (
                <Link
                  to={`/user/${data.author}`}
                  className="text-xs font-light hover:underline flex items-center gap-x-2"
                >
                  <Avatar
                    src={data.authorAvatar || DefaultUser}
                    className="w-6 h-6"
                  />
                  {`u/${data.author}`}
                </Link>
              )}
            </div>
          </div>
          <span className="text-md w-full text-blue-gray-800 break-words">
            {data.title}
          </span>
        </div>
        <div className="text-xs  font-light">
          {data.voteCount + ` ${data.commentCount > 1 ? "votes" : "vote"}`}{" "}
          &middot;{" "}
          {data.commentCount +
            ` ${data.commentCount > 1 ? "comments" : "comment"}`}
        </div>
      </div>

      {data.attachments[0] && (
        <div className="flex ml-3  overflow-hidden rounded-lg relative aspect-[4/3] h-24 action">
          <ImageWithLoading
            src={data.attachments[0].url}
            className="object-cover w-full h-full"
          />
          {data.attachments.length > 1 && (
            <div className="absolute bg-black/60 bottom-0 px-1 py-0.5 m-1 rounded-full text-white/80 flex items-center gap-x-1">
              <Images className="w-3 h-3" />
              <span className="text-[0.6rem]">{data.attachments.length}</span>
            </div>
          )}
        </div>
      )}

      <div className="absolute top-0 right-0 m-2 bg-blue-gray-100 rounded-full">
        <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
          <MenuHandler>
            <div className="flex items-center rounded-full p-1 text-blue-gray-600">
              <Ellipsis className="w-4 h-4" />
            </div>
          </MenuHandler>
          <MenuList className="p-1">
            {menuItem.map(({ label, icon, handle }) => {
              return (
                <MenuItem
                  key={label}
                  onClick={handle}
                  className={`flex items-center gap-2 rounded`}
                >
                  {React.createElement(icon, {
                    className: cn(`h-4 w-4 text-blue-gray-700`),
                    strokeWidth: 2
                  })}
                  <Typography as={"span"} className={cn("font-normal text-sm")}>
                    {label}
                  </Typography>
                </MenuItem>
              );
            })}
          </MenuList>
        </Menu>
      </div>
    </div>
  );
};

export default TrashPost;
