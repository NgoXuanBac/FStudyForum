import { Bookmark, Ellipsis, Flag, Pencil, Trash2 } from "lucide-react";
import { Response } from "@/types/response";
import React from "react";
import {
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
  Dialog
} from "@material-tailwind/react";
import { cn } from "@/helpers/utils";
import { Post } from "@/types/post";
import { useAuth } from "@/hooks/useAuth";
import { AxiosError } from "axios";
import PostService from "@/services/PostService";
import ReportForm from "../report/ReportForm";
import { showErrorToast, showSuccessToast } from "@/helpers/toast";
import BanForm from "./BanForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EditPostForm from "./EditPostForm";

const Popups = {
  BAN: 0,
  REPORT: 1,
  EDIT: 2
};

type Props = {
  post: Post;
};

const MenuItemPost: React.FC<Props> = ({ post }) => {
  const [openPopup, setOpenPopup] = React.useState(-1);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const switchOpenReport = () =>
    setOpenPopup(pre => (pre == -1 ? Popups.REPORT : -1));
  const switchOpenBan = () =>
    setOpenPopup(pre => (pre == -1 ? Popups.BAN : -1));
  const switchOpenEdit = () =>
    setOpenPopup(pre => (pre == -1 ? Popups.EDIT : -1));

  const { mutate: handleSave } = useMutation({
    mutationFn: PostService.save,
    onSuccess: message => {
      showSuccessToast(message);
      queryClient.invalidateQueries({
        queryKey: ["POST_LIST"],
        refetchType: "all"
      });
      queryClient.invalidateQueries({
        queryKey: ["POST_DETAIL", post.id.toString()]
      });
    },
    onError: e => {
      const error = e as AxiosError<Response>;
      showErrorToast(
        (error?.response?.data as Response)?.message || error.message
      );
    }
  });

  const { mutate: handleRemoveFromSaved } = useMutation({
    mutationFn: PostService.removeFromSaved,
    onSuccess: message => {
      showSuccessToast(message);
      queryClient.invalidateQueries({
        queryKey: ["POST_LIST"],
        refetchType: "all"
      });
      queryClient.invalidateQueries({
        queryKey: ["POST_DETAIL", post.id.toString()]
      });
    },
    onError: e => {
      const error = e as AxiosError<Response>;
      showErrorToast(
        (error?.response?.data as Response)?.message || error.message
      );
    }
  });

  const { mutate: handleMoveToTrash } = useMutation({
    mutationFn: PostService.moveToTrash,
    onSuccess: message => {
      showSuccessToast(message);
      queryClient.invalidateQueries({
        queryKey: ["POST_LIST"],
        refetchType: "all"
      });
    },
    onError: e => {
      const error = e as AxiosError<Response>;
      showErrorToast(
        (error?.response?.data as Response)?.message || error.message
      );
    }
  });

  const defaultMenuItem = [
    {
      icon: Bookmark,
      label: post.isSaved ? "Remove from saved" : "Save",
      handle: () =>
        !post.isSaved ? handleSave(post.id) : handleRemoveFromSaved(post.id)
    },
    {
      icon: Flag,
      label: "Report",
      handle: () => {
        switchOpenReport();
      }
    }
  ];

  const authorMenuItem = [
    {
      icon: Pencil,
      label: "Edit post",
      handle: () => {
        switchOpenEdit();
      }
    },
    {
      icon: Bookmark,
      label: post.isSaved ? "Remove from saved" : "Save",
      handle: () =>
        !post.isSaved ? handleSave(post.id) : handleRemoveFromSaved(post.id)
    },
    {
      icon: Flag,
      label: "Report",
      handle: () => {
        switchOpenReport();
      }
    },
    {
      icon: Trash2,
      label: "Move to trash",
      handle: () => handleMoveToTrash(post.id)
    }
  ];

  const menuItem = () => {
    return user?.username === post.author ? authorMenuItem : defaultMenuItem;
  };

  return (
    <>
      <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
        <MenuHandler>
          <Button
            variant="text"
            color="blue-gray"
            className="flex items-center rounded-full p-2 text-black"
          >
            <Ellipsis className="w-4 h-4" />
          </Button>
        </MenuHandler>
        <MenuList className="p-1">
          {menuItem().map(({ label, icon, handle }) => {
            const isSaveItem = label == "Remove from saved" || label == "Save";
            return (
              <MenuItem
                key={label}
                onClick={handle}
                className={`flex items-center gap-2 rounded`}
              >
                {React.createElement(icon, {
                  className: cn(
                    `h-4 w-4 text-blue-gray-700`,
                    isSaveItem && post.isSaved && "fill-blue-gray-700"
                  ),
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
      <Dialog
        className="max-w-[34rem] p-5 max-h-full"
        open={openPopup == Popups.REPORT}
        handler={switchOpenReport}
      >
        <ReportForm
          postId={post.id}
          topicName={post.topicName}
          handler={switchOpenReport}
        />
      </Dialog>
      <Dialog
        className="max-w-[34rem] p-5 max-h-full"
        open={openPopup == Popups.BAN}
        handler={switchOpenBan}
      >
        <BanForm post={post} handler={switchOpenBan} />
      </Dialog>

      <Dialog
        className="max-w-[34rem] p-2"
        open={openPopup == Popups.EDIT}
        handler={switchOpenBan}
      >
        <EditPostForm post={post} handler={switchOpenEdit} />
      </Dialog>
    </>
  );
};
export default MenuItemPost;
