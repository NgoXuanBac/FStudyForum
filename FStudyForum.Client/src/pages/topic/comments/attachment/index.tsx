import { FC } from "react";
import useSearchParam from "@/hooks/useSearchParam";
import { cn } from "@/helpers/utils";
import Carousel from "@/components/attachment/Carousel";
import { NavList, ProfileMenu } from "@/components/layout/Header";
import CommentBox from "@/components/attachment/Comment";
import { Icons } from "@/components/Icons";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { X } from "lucide-react";
import { useRouterParam } from "@/hooks/useRouterParam";

const AttachmentPage: FC = () => {
  const navigate = useNavigate();
  const { attachmentId } = useParams<{ attachmentId: string }>();
  const [isExpand, setIsExpand] = useSearchParam<"true" | "false">({
    key: "full",
    defaultValue: "false"
  });
  const { post } = useRouterParam();
  const handleExpand = () => setIsExpand(isExpand == "true" ? "false" : "true");
  if (!post) return;
  if (!post.attachments.length) return <Navigate to={"/not-found"} />;

  const openDetail = (id: number) => {
    if (post.topicName)
      navigate(
        `/topic/${post.topicName}/comments/${post.id}/attachment/${id}?full=${isExpand}`
      );
    else
      navigate(
        `/user/${post.author}/comments/${post.id}/attachment/${id}?full=${isExpand}`
      );
  };

  const current = post.attachments.findIndex(
    a => a.id.toString() == attachmentId
  );

  const handleNext = () => {
    const last = post.attachments.length - 1;
    openDetail(post.attachments[current == last ? 0 : current + 1].id);
  };

  const handlePrev = () => {
    const last = post.attachments.length - 1;
    openDetail(post.attachments[current == 0 ? last : current - 1].id);
  };

  return (
    <div className="w-full h-screen flex relative">
      <div className="absolute top-0 z-10 h-14 flex items-center justify-center mx-2 xl:mx-4">
        <button
          key="my-button"
          type="button"
          className="rounded-full bg-gray-900/40 hover:bg-gray-900/50 p-2 text-white"
          onClick={() => navigate(-1)}
        >
          <X strokeWidth={2} className="w-6 h-6" />
        </button>
        <Link to="/" className="p-2 rounded-full">
          <Icons.logo className="h-8 w-8" />
        </Link>
      </div>
      <div
        className={cn(
          "fixed w-[calc(100%-24rem)]",
          isExpand == "true" && "w-full"
        )}
      >
        <div className="w-full h-screen z-0">
          <Carousel
            slide={{
              src: post.attachments[current].url,
              width: 3840,
              height: 5760
            }}
            expand={isExpand == "true"}
            onNext={handleNext}
            onPrev={handlePrev}
            hideArrow={post.attachments.length == 1}
            onExpand={handleExpand}
          />
        </div>
      </div>
      <div
        className={cn(
          "ml-[calc(100%-24rem)] w-[24rem] h-full",
          isExpand == "true" && "hidden"
        )}
      >
        <div className="h-14 w-[24rem] fixed top-0 border-b bg-white shadow-sm">
          <div className="px-2 h-full w-full flex items-center justify-end gap-x-2">
            <div className="hidden lg:block ">
              <NavList />
            </div>

            <ProfileMenu />
          </div>
        </div>
        <div className="mt-14 w-full h-[calc(100%-3.5rem)] p-2">
          <CommentBox />
        </div>
      </div>
    </div>
  );
};

export default AttachmentPage;
