import { cn } from "@/helpers/utils";
import { FC, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface CommentInputProps {
  onSubmit: (content: string) => void;
}

const CommentInput: FC<CommentInputProps> = ({ onSubmit }) => {
  const [newComment, setNewComment] = useState("");
  const [openInput, setOpenInput] = useState(false);

  const handleSubmit = () => {
    setOpenInput(false);
    onSubmit(newComment);
    setNewComment("");
  };

  return (
    <div className="mt-4">
      <button
        className={cn(
          "border p-2 w-full rounded-full text-left",
          openInput && "hidden"
        )}
        onClick={() => setOpenInput(true)}
      >
        <span className="text-sm font-normal text-gray-700 pl-2">
          Add a comment
        </span>
      </button>

      {openInput && (
        <div className={cn("border rounded-2xl")}>
          <TextareaAutosize
            autoFocus
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            className={cn(
              "w-full appearance-none overflow-hidden bg-transparent",
              "text-sm focus:outline-none py-3 px-4"
            )}
          />
          <div className="w-full flex justify-end gap-x-2 px-2 py-1">
            <button
              onClick={() => {
                setOpenInput(false);
                setNewComment("");
              }}
              className="rounded-full p-2 bg-gray-300 text-black text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="rounded-full p-2 bg-orange-800 text-white text-xs"
            >
              Comment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentInput;
