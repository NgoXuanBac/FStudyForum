import { FC, useCallback, useRef, useState } from "react";
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Plus,
  Minus
} from "lucide-react";
import { Comment } from "@/types/comment";
import ReplyInput from "@/components/comment/ReplyInput";
import MenuItemComment from "@/components/comment/MenuItem";
import CommentEditor from "@/components/comment/CommentEditor";
import Default from "@/assets/images/user.png";
import { cn, formatElapsedTime } from "@/helpers/utils";
import { Link } from "react-router-dom";
import { VoteTypes } from "@/helpers/constants";
import VoteService from "@/services/VoteService";
import { useSize } from "@/hooks/useSize";

type CommentItemProps = {
  comment: Comment;
  level: number;
  expandedComments: { [key: number]: boolean };
  toggleExpand: (commentId: number) => void;
  handleReplyClick: (commentId: number | null) => void;
  handleDeleteComment: (id: string) => Promise<void>;
  handleCreateReply: (commentId: number, content: string) => void;
  handleEditComment: (commentId: number | null) => void;
  handleSaveEditedComment: (commentId: number, content: string) => void;
  replyToCommentId: number | null;
  editingCommentId: number | null;
};

const CommentItem: FC<CommentItemProps> = ({
  comment,
  level,
  expandedComments,
  toggleExpand,
  handleReplyClick,
  handleDeleteComment,
  handleCreateReply,
  handleEditComment,
  handleSaveEditedComment,
  replyToCommentId,
  editingCommentId
}) => {
  const [voteType, setVoteType] = useState(comment.voteType);
  const [voteCount, setVoteCount] = useState(comment.voteCount);
  const lastCommentChildRef = useRef<HTMLDivElement>(null);
  const { height } = useSize(lastCommentChildRef);
  const isExpand = useCallback(
    () => expandedComments[comment.id],
    [comment.id, expandedComments]
  );
  const handleVote = async (type: number) => {
    const realType = voteType === type ? VoteTypes.UNVOTE : type;
    setVoteType(realType);
    setVoteCount(comment.voteCount - comment.voteType + realType);
    try {
      const count = await VoteService.voteComment(comment.id, realType);
      setVoteCount(count);
    } catch (error) {
      setVoteType(voteType);
      setVoteCount(comment.voteCount);
    }
  };

  return (
    <div key={comment.id} className="py-2 comment" data-level={level}>
      <div className="flex flex-col h-full">
        <div className="flex items-center h-full gap-x-2 relative">
          {level > 0 && (
            <div className="-z-10 absolute -top-4 -left-[1.05rem] ">
              <div className="bottom-0 left-1/2 w-4 h-8 border-b-2 border-l-2 border-gray-400 rounded-bl-xl" />
            </div>
          )}
          <img
            src={comment.avatar || Default}
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
          <div className="flex items-center">
            <Link
              to={`/user/${comment.author}`}
              className="action text-xs font-medium"
            >
              {comment.author}
            </Link>
            <span className="text-xs font-light ml-1">•</span>
            <span className="text-xs font-light ml-1">
              {formatElapsedTime(comment.elapsed)}
            </span>
          </div>
        </div>
        <div className="flex flex-col relative">
          <div
            className={cn(
              "z-0 flex justify-center w-8",
              "absolute top-0 bottom-0 left-0"
            )}
          >
            {(comment.replies?.length ?? 0) > 0 && (
              <div
                style={
                  height !== 0 ? { height: `calc(100% - ${height}px)` } : {}
                }
                className={cn("w-[0.1rem] bg-gray-400", "mb-4")}
              />
            )}
          </div>
          <div className="flex-1 ml-10 z-10">
            {editingCommentId === comment.id ? (
              <div className="mb-2">
                <CommentEditor
                  commentId={comment.id}
                  content={comment.content}
                  onSave={handleSaveEditedComment}
                  onCancel={() => handleEditComment(null)}
                />
              </div>
            ) : (
              <span className="text-sm break-words  min-w-0">
                {comment.content}
              </span>
            )}
          </div>
          <div className="w-full z-10 flex">
            <div className="w-8 mt-2">
              {comment.replies && comment.replies.length > 0 && (
                <button
                  className="flex items-center space-x-1 w-full justify-center bg-white"
                  onClick={() => toggleExpand(comment.id)}
                >
                  <div className="p-0.5 border-2 border-gray-500 rounded-full text-xs text-gray-500">
                    {isExpand() ? (
                      <Minus size={10} strokeWidth={3} />
                    ) : (
                      <Plus size={10} strokeWidth={3} />
                    )}
                  </div>
                </button>
              )}
            </div>

            <div className="flex-1">
              <div className="flex space-x-2 text-gray-700">
                <div className={cn("action flex items-center min-w-0")}>
                  <div
                    className="hover:bg-blue-gray-900/15 rounded-full p-[0.25rem] cursor-pointer"
                    onClick={() => handleVote(VoteTypes.UP)}
                  >
                    <ArrowBigUp
                      strokeWidth={1.2}
                      fill={
                        voteType === VoteTypes.UP ? "#ef5350" : "transparent"
                      }
                      className={cn(
                        "w-6 h-6 hover:text-red-400",
                        voteType === VoteTypes.UP && "text-red-400"
                      )}
                    />
                  </div>
                  <span className={cn("text-xs font-medium")}>{voteCount}</span>
                  <div
                    className="hover:bg-blue-gray-900/15 rounded-full p-[0.25rem] cursor-pointer"
                    onClick={() => handleVote(VoteTypes.DOWN)}
                  >
                    <ArrowBigDown
                      strokeWidth={1.2}
                      fill={
                        voteType === VoteTypes.DOWN ? "#42a5f5" : "transparent"
                      }
                      className={cn(
                        "w-6 h-6 hover:text-blue-400",
                        voteType === VoteTypes.DOWN && "text-blue-400"
                      )}
                    />
                  </div>
                </div>
                <div
                  className={cn(
                    "flex items-center px-3 py-1 rounded-full space-x-2",
                    level > 3
                      ? "cursor-not-allowed opacity-50"
                      : "bg-blue-gray-30 hover:bg-blue-gray-100/75 cursor-pointer select-none"
                  )}
                  onClick={() => level <= 3 && handleReplyClick(comment.id)}
                >
                  <MessageSquare
                    strokeWidth={1.8}
                    className={cn("w-4 h-4", level > 3 && "text-gray-400")}
                  />
                  <span className={cn("text-xs", level > 3 && "text-gray-400")}>
                    Reply
                  </span>
                </div>
                <div className="action flex items-center">
                  <MenuItemComment
                    key={comment.id}
                    comment={comment}
                    onDelete={handleDeleteComment}
                    onEdit={handleEditComment}
                  />
                </div>
              </div>
              {replyToCommentId === comment.id && (
                <div className="mt-2">
                  <ReplyInput
                    commentId={comment.id}
                    onSubmit={handleCreateReply}
                    onCancel={() => handleReplyClick(null)}
                  />
                </div>
              )}
              {expandedComments[comment.id] && (
                <>
                  {comment.replies?.map((reply, index) => (
                    <div
                      key={reply.id}
                      className={cn("comment-child")}
                      ref={
                        index + 1 == comment.replies?.length
                          ? lastCommentChildRef
                          : null
                      }
                    >
                      <CommentItem
                        comment={reply}
                        level={level + 1}
                        expandedComments={expandedComments}
                        toggleExpand={toggleExpand}
                        handleReplyClick={handleReplyClick}
                        handleDeleteComment={handleDeleteComment}
                        handleCreateReply={handleCreateReply}
                        handleEditComment={handleEditComment}
                        handleSaveEditedComment={handleSaveEditedComment}
                        replyToCommentId={replyToCommentId}
                        editingCommentId={editingCommentId}
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
