import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Alert, Spinner } from "@material-tailwind/react";
import CommentService from "@/services/CommentService";
import PostItem from "@/components/post/PostItem";
import { Response } from "@/types/response";
import { Comment, CreateComment } from "@/types/comment";
import CommentInput from "@/components/comment/CommentInput";
import ContentLayout from "@/components/layout/ContentLayout";
import CommentItem from "@/components/comment/CommentItem";
import TopicDescription from "@/components/topic/TopicDescription";
import { useRouterParam } from "@/hooks/useRouterParam";

const Comments = () => {
  const navigate = useNavigate();
  const { name: topicName, id: postId } = useParams<{
    name: string;
    id: string;
  }>();
  const { post } = useRouterParam();
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedComments, setExpandedComments] = useState<{
    [key: number]: boolean;
  }>({});

  const initializeExpandedComments = (
    comments: Comment[],
    amount: number = 3
  ) => {
    const expanded: { [key: number]: boolean } = {};
    const traverseComments = (commentList: Comment[]) => {
      commentList.forEach(comment => {
        expanded[comment.id] =
          !comment.replies || comment.replies.length < amount;
        if (comment.replies) {
          traverseComments(comment.replies);
        }
      });
    };
    traverseComments(comments);
    return expanded;
  };

  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) return;

      setLoading(true);
      try {
        const data = await CommentService.getCommentsByPostId(postId);
        const structuredComments = structureComments(data || []);
        setComments(structuredComments);
        setExpandedComments(initializeExpandedComments(structuredComments));
      } catch (e) {
        const error = e as AxiosError;
        setError((error?.response?.data as Response)?.message || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const structureComments = (comments: Comment[]) => {
    const map: { [key: number]: Comment } = {};
    const roots: Comment[] = [];
    comments.forEach(comment => {
      comment.replies = [];
      map[comment.id] = comment;
      if (comment.replyId == null) {
        roots.push(comment);
      } else {
        if (map[comment.replyId]) {
          map[comment.replyId].replies?.push(comment);
        } else {
          map[comment.replyId] = { ...comment, replies: [comment] };
        }
      }
    });
    return roots;
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleDeleteComment = async (id: string) => {
    try {
      await CommentService.deleteComment(id);
      setComments(prevComments => removeCommentById(prevComments, Number(id)));
    } catch (e) {
      const error = e as AxiosError<Response>;
      setError((error?.response?.data as Response)?.message || error.message);
    }
  };

  const removeCommentById = (comments: Comment[], id: number): Comment[] => {
    return comments
      .filter(comment => comment.id !== id)
      .map(comment => ({
        ...comment,
        replies: removeCommentById(comment.replies || [], id)
      }));
  };

  const handleCreateComment = async (content: string) => {
    try {
      if (!postId) return;
      const newCommentData = await CommentService.createComment({
        postId: Number(postId),
        content
      } as CreateComment);

      const updatedComment = await CommentService.getCommentById(
        newCommentData.id.toString()
      );
      setComments([...comments, updatedComment]);
    } catch (e) {
      const error = e as AxiosError;
      setError((error?.response?.data as Response)?.message || error.message);
    }
  };

  const addReplyToComments = (
    comments: Comment[],
    reply: Comment,
    commentId: number
  ): Comment[] => {
    return comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, replies: [...(comment.replies || []), reply] };
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: addReplyToComments(comment.replies, reply, commentId)
        };
      }
      return comment;
    });
  };

  const handleCreateReply = async (commentId: number, content: string) => {
    try {
      if (!postId) return;
      const newReplyData = await CommentService.createComment({
        postId: Number(postId),
        replyId: commentId,
        content
      } as CreateComment);

      // Fetch the updated reply to get complete data
      const updatedReply = await CommentService.getCommentById(
        newReplyData.id.toString()
      );
      const updatedComments = addReplyToComments(
        comments,
        updatedReply,
        commentId
      );
      setComments(updatedComments);
      setReplyToCommentId(null);

      setExpandedComments(initializeExpandedComments(updatedComments, 100));
    } catch (e) {
      const error = e as AxiosError;
      setError((error?.response?.data as Response)?.message || error.message);
    }
  };

  const handleReplyClick = (commentId: number | null) => {
    setReplyToCommentId(commentId);
  };

  const handleEditComment = (commentId: number | null) => {
    setEditingCommentId(commentId);
  };

  const handleSaveEditedComment = async (
    commentId: number,
    content: string
  ) => {
    try {
      await CommentService.updateComment(commentId.toString(), { content });
      setComments(prevComments =>
        updateCommentInTree(prevComments, commentId, content)
      );
      setEditingCommentId(null);
    } catch (e) {
      const error = e as AxiosError;
      setError((error?.response?.data as Response)?.message || error.message);
    }
  };

  const updateCommentInTree = (
    comments: Comment[],
    commentId: number,
    content: string
  ): Comment[] => {
    return comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, content };
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentInTree(comment.replies, commentId, content)
        };
      }
      return comment;
    });
  };

  const toggleExpand = (commentId: number) => {
    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  if (loading || !post) return <Spinner className="mx-auto" />;

  return (
    <ContentLayout pannel={topicName ? <TopicDescription /> : undefined}>
      <div className="relative">
        {error && (
          <Alert color="red" className="mb-4">
            {error}
          </Alert>
        )}
        {loading && <p>Loading...</p>}
        <div
          onClick={handleBack}
          className="rounded-full bg-blue-gray-50 hover:bg-blue-gray-100 p-2 absolute top-0 -left-10 hidden lg:block"
        >
          <ArrowLeft className="w-4 h-4" />
        </div>
        <PostItem data={post} hideLess={false} />
        <div className="px-4">
          <CommentInput onSubmit={handleCreateComment} />
        </div>
        <div className="mt-4 px-4">
          {comments && comments.length > 0 ? (
            comments
              .slice()
              .reverse()
              .map(comment => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  level={0}
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
              ))
          ) : (
            <p className="text-sm text-center">No comments yet</p>
          )}
        </div>
      </div>
    </ContentLayout>
  );
};

export default Comments;
