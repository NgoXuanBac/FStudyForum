import React from "react";
import { Avatar, Spinner } from "@material-tailwind/react";
import { useRouterParam } from "@/hooks/useRouterParam";
import ContentLayout from "@/components/layout/ContentLayout";
import ImageWithLoading from "@/components/ui/ImageWithLoading";
import BannerDefault from "@/assets/images/banner.png";
import AvatarDefault from "@/assets/images/user.png";
import TopicDescription from "@/components/topic/TopicDescription";
import useSearchParam from "@/hooks/useSearchParam";
import PostFilter from "@/components/post/PostFilter";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LIMIT_SCROLLING_PAGNATION_RESULT } from "@/helpers/constants";
import PostService from "@/services/PostService";
import { useInView } from "react-intersection-observer";
import PostItem from "@/components/post/PostItem";
import { Link } from "react-router-dom";
const TopicDetail: React.FC = () => {
  const { topic } = useRouterParam();
  const [filter, setFilter] = useSearchParam<string>({
    key: "filter",
    defaultValue: "New"
  });

  const { ref, inView } = useInView();

  const { data, fetchNextPage, isPending, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["POST_LIST", "BY_TOPIC", topic?.name, { filter }],
      queryFn: async ({ pageParam = 1 }) => {
        try {
          return await PostService.getPostsByTopicName(
            topic!.name,
            pageParam,
            LIMIT_SCROLLING_PAGNATION_RESULT,
            filter
          );
        } catch (e) {
          return [];
        }
      },
      getNextPageParam: (last, pages) =>
        last.length ? pages.length + 1 : undefined,
      initialPageParam: 1,
      enabled: !!topic
    });
  React.useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);
  if (!topic || isPending) {
    return <Spinner className="mx-auto" />;
  }
  const posts = data?.pages.flatMap(p => p) ?? [];

  return (
    <ContentLayout pannel={<TopicDescription />}>
      <div className="flex flex-col items-center w-full mb-14">
        <div className="relative w-full max-w-screen-lg">
          <div className="w-full rounded-none md:rounded-lg h-28 overflow-hidden">
            <ImageWithLoading
              src={topic.banner || BannerDefault}
              className="object-cover w-full h-full "
            />
          </div>
          <div className="absolute -bottom-1/3 left-4">
            <Avatar
              variant="circular"
              size="xl"
              alt="avatar"
              className="bg-white  p-0.5"
              src={topic.avatar || AvatarDefault}
            />
          </div>

          <div className="absolute left-24 flex items-center gap-x-2">
            <p className="text-md font-semibold">t/{topic.name}</p>
          </div>
          <Link
            className="absolute right-0 bg-blue-600 text-white px-4 py-2 text-xs rounded-full my-2"
            to="moderator"
          >
            Mod tools
          </Link>
        </div>
      </div>
      <div className="pb-2 border-b-2">
        <div className="relative flex text-left z-20 mx-2">
          <PostFilter setFilter={setFilter} filter={filter} />
        </div>
      </div>
      <div className="pt-1">
        {posts.map((post, index) => {
          return (
            <div key={index} className="w-full">
              <div className="hover:bg-gray-50 rounded-lg w-full cursor-auto">
                <PostItem key={index} data={post} />
              </div>
              <hr className="my-1 border-blue-gray-50" />
            </div>
          );
        })}
        <div ref={ref} className="text-center">
          {isFetchingNextPage ? (
            <Spinner className="mx-auto" />
          ) : (
            !isPending && (
              <span className="text-xs font-light">Nothing more</span>
            )
          )}
        </div>
      </div>
    </ContentLayout>
  );
};

export default TopicDetail;
