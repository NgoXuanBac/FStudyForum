import { FC } from "react";
import MenuItemPost from "./MenuItem";
import { MessageSquare, Share } from "lucide-react";
import { Post } from "@/types/post";
import { Avatar } from "@material-tailwind/react";
import DefaultTopic from "@/assets/images/topic.png";
import DefaultUser from "@/assets/images/user.png";

import { cn, formatElapsedTime } from "@/helpers/utils";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import EditorOutput from "./EditorOutput";
import AttachmentContainer from "./AttachmentContainer";
import PostVote from "./PostVote";

type PostProps = {
  data: Post;
  hideLess?: boolean;
};
const PostItem: FC<PostProps> = ({ data, hideLess = true }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const actionRefs = React.useRef<HTMLElement[]>([]);
  const navigate = useNavigate();

  const handleRemainClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!hideLess || !containerRef.current) return;
    const actions = Array.from(
      containerRef.current.querySelectorAll(".action")
    ) as HTMLElement[];
    actionRefs.current = actions;

    if (
      containerRef.current &&
      containerRef.current.contains(event.target as Node) &&
      !actionRefs.current.some(action => action.contains(event.target as Node))
    ) {
      if (data.topicName)
        navigate(`/topic/${data.topicName}/comments/${data.id}`);
      else navigate(`/user/${data.author}/comments/${data.id}`);
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleRemainClick}
      className="py-1 px-4 w-full"
    >
      <div className="flex justify-between">
        <div className="flex items-center gap-x-2">
          {data.topicName ? (
            <Link
              to={`/topic/${data.topicName}`}
              className="action flex items-center gap-x-2 z-0"
            >
              <Avatar
                src={data.topicAvatar || DefaultTopic}
                className="w-6 h-6"
              />
            </Link>
          ) : (
            <Link
              to={`/user/${data.author}`}
              className="action flex items-center gap-x-2 z-0"
            >
              <Avatar
                src={data.authorAvatar || DefaultUser}
                className="w-6 h-6"
              />
            </Link>
          )}
          <div className="flex flex-col">
            <div className="flex gap-x-1">
              {data.topicName ? (
                <Link
                  to={`/topic/${data.topicName}`}
                  className="text-xs action"
                >{`t/${data.topicName}`}</Link>
              ) : (
                <Link
                  to={`/user/${data.author}`}
                  className="text-xs action"
                >{`u/${data.author}`}</Link>
              )}

              {hideLess && data.topicName && (
                <>
                  <span className="text-xs font-light hidden lg:block">•</span>
                  <Link
                    to={`/user/${data.author}`}
                    className="action text-xs font-light hidden lg:block"
                  >{`Posted by u/${data.author}`}</Link>
                </>
              )}
              <span className="text-xs font-light">•</span>
              <span className="text-xs font-light">
                {formatElapsedTime(data.elapsed)}
              </span>
            </div>
            {!hideLess && (
              <Link
                to={`/user/${data.author}`}
                className="action text-xs font-light hidden lg:block"
              >
                {data.author}
              </Link>
            )}
          </div>
        </div>
        <MenuItemPost post={data} />
      </div>
      <div
        className={cn("my-2 flex flex-col gap-y-2 w-full text-blue-gray-800")}
      >
        <p className="font-semibold ">{data.title}</p>
        <EditorOutput content={data.content} hide={hideLess} className="mb-2" />

        <AttachmentContainer post={data} />
      </div>
      <div className="flex space-x-4 text-gray-700">
        <PostVote
          postId={data.id}
          initCount={data.voteCount}
          initType={data.voteType}
        />
        <div className="flex items-center px-3 py-1 rounded-full space-x-2 bg-blue-gray-50 hover:bg-blue-gray-100/75 cursor-pointer">
          <MessageSquare strokeWidth={1.8} className="w-4 h-4" />
          <span className="text-xs">{data.commentCount}</span>
        </div>
        <div className="action flex items-center space-x-2 px-3 rounded-full  bg-blue-gray-50 hover:bg-blue-gray-100/75 transition cursor-pointer">
          <Share className="w-4 h-4 text-gray-700" strokeWidth={1.8} />
          <span className="text-blue-gray-700 text-xs">Share</span>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
