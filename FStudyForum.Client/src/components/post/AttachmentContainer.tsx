import { Attachment } from "@/types/attachment";
import { FC } from "react";
import ImageWithLoading from "../ui/ImageWithLoading";
import { Carousel } from "@material-tailwind/react";
import React from "react";
import { cn } from "@/helpers/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSize } from "@/hooks/useSize";
import { useNavigate } from "react-router-dom";
import { Post } from "@/types/post";

type Props = {
  post: Post;
};

const getSizeFromPath = (path: string): { width: number; height: number } => {
  const regex = /attachment[^_]+_width(\d+)_height(\d+)/;
  const match = path.match(regex);

  if (match && match[1] && match[2]) {
    return {
      width: parseInt(match[1], 10),
      height: parseInt(match[2], 10)
    };
  }
  return {
    width: 1,
    height: 1
  };
};

const getContainerHeight = (
  attachments: Attachment[],
  containerWidth: number
): number => {
  return Math.max(
    ...attachments.map(a => {
      const size = getSizeFromPath(a.url);
      return (size.height / size.width) * containerWidth;
    })
  );
};

const AttachmentContainer: FC<Props> = ({ post }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { width } = useSize(containerRef);
  const [height, setHeight] = React.useState(0);
  React.useEffect(() => {
    if (width != 0 && containerRef.current != null)
      setHeight(getContainerHeight(post.attachments, width));
  }, [post.attachments, width]);

  const openDetail = (id: number) => {
    if (post.topicName)
      navigate(`/topic/${post.topicName}/comments/${post.id}/attachment/${id}`);
    else navigate(`/user/${post.author}/comments/${post.id}/attachment/${id}`);
  };

  if (post.attachments.length == 0) return null;

  return (
    <div className="action w-full z-0" ref={containerRef}>
      {post.attachments.length == 1 ? (
        <div
          style={{ height: height }}
          className={cn(
            "max-h-[28rem] w-full object-contain relative overflow-hidden rounded-md "
          )}
          onClick={() => openDetail(post.attachments[0].id)}
        >
          <img
            src={post.attachments[0].url}
            className="scale-125 absolute top-1/2 left-0 object-cover opacity-30 -translate-y-1/2 blur-xl w-full"
            loading="lazy"
          />
          <ImageWithLoading
            src={post.attachments[0].url}
            className={`object-contain w-full h-full relative`}
          />
        </div>
      ) : (
        <Carousel
          navigation={({ setActiveIndex, activeIndex, length }) => (
            <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2 bg-blue-gray-900/50 p-1.5 rounded-lg">
              {new Array(length).fill("").map((_, i) => (
                <span
                  key={i}
                  className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                    activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
                  }`}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </div>
          )}
          prevArrow={({ handlePrev, firstIndex }) => (
            <div
              onClick={handlePrev}
              className={cn(
                "!absolute p-1.5 top-2/4 !left-4 -translate-y-2/4 rounded-full bg-gray-900/50 text-white/50 hover:text-white hover:bg-gray-900/80",
                firstIndex && "!bg-transparent"
              )}
            >
              <ChevronLeft
                strokeWidth={3}
                className={cn(
                  "w-5 h-5 text-white",
                  firstIndex && "text-transparent"
                )}
              />
            </div>
          )}
          nextArrow={({ handleNext, lastIndex }) => (
            <div
              onClick={handleNext}
              className={cn(
                "!absolute p-1.5 top-2/4 !right-4 -translate-y-2/4 rounded-full bg-gray-900/50 text-white/50 hover:text-white hover:bg-gray-900/80",
                lastIndex && "!bg-transparent"
              )}
            >
              <ChevronRight
                strokeWidth={3}
                className={cn(
                  "w-5 h-5 text-white",
                  lastIndex && "text-transparent"
                )}
              />
            </div>
          )}
          className="overflow-hidden rounded-md text-sm"
        >
          {post.attachments.map((file, index) => (
            <div
              key={index}
              style={{ height: height }}
              className="max-h-[28rem] object-contain relative overflow-hidden "
              onClick={() => openDetail(file.id)}
            >
              <img
                src={file.url}
                className="scale-125 absolute top-1/2 left-0 object-cover opacity-30 -translate-y-1/2 blur-xl w-full"
                loading="lazy"
              />
              <ImageWithLoading
                src={file.url}
                className={`object-contain w-full h-full relative`}
              />
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default AttachmentContainer;
