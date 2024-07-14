import { Post } from "@/types/post";
import { Avatar } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { Images } from "lucide-react";
import DefaultTopic from "@/assets/images/topic.png";
import DefaultUser from "@/assets/images/user.png";

import ImageWithLoading from "../ui/ImageWithLoading";
import React from "react";
import LightBox from "../post/LightBox";

interface Props {
  data: Post;
  keyword: string;
}
const SearchPost: React.FC<Props> = ({ data, keyword }) => {
  const [open, setOpen] = React.useState(-1);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const actionRefs = React.useRef<HTMLElement[]>([]);
  const navigate = useNavigate();

  const openLightBox = (index?: number) => {
    setOpen(index ?? 0);
  };
  const handleRemainClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const actions = Array.from(
      containerRef.current.querySelectorAll(".action")
    ) as HTMLElement[];
    actionRefs.current = actions;

    if (
      containerRef.current &&
      containerRef.current.contains(event.target as Node) &&
      !actionRefs.current.some(action => action.contains(event.target as Node))
    ) {
      navigate(`/topic/${data.topicName}/comments/${data.id}`);
    }
  };

  const regex = new RegExp(`(${keyword})`, "gi");

  return (
    <div className="flex p-2" ref={containerRef} onClick={handleRemainClick}>
      <div className="flex flex-col gap-y-2 grow justify-between w-3/5">
        <div>
          {data.topicName ? (
            <Link
              to={`/topic/${data.topicName}`}
              className="action w-fit text-xs font-light hover:underline flex items-center gap-x-2"
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
              className="action w-fit text-xs font-light hover:underline flex items-center gap-x-2"
            >
              <Avatar
                src={data.authorAvatar || DefaultUser}
                className="w-6 h-6"
              />
              {`u/${data.author}`}
            </Link>
          )}

          <span className="text-md w-full text-blue-gray-800 break-words">
            {data.title.split(regex).map((part, index) =>
              regex.test(part) ? (
                <strong className="font-semibold" key={index}>
                  {part}
                </strong>
              ) : (
                part
              )
            )}
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
        <div
          className="flex ml-3  overflow-hidden rounded-lg relative aspect-[4/3] h-24 action"
          onClick={() => openLightBox(0)}
        >
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
      <LightBox
        index={open}
        sliders={data.attachments.map(file => ({ src: file.url }))}
        close={() => setOpen(-1)}
      />
    </div>
  );
};

export default SearchPost;
