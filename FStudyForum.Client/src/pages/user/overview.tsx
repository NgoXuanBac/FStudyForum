import ContentLayout from "@/components/layout/ContentLayout";
import PostItem from "@/components/post/PostItem";
import { LIMIT_SCROLLING_PAGNATION_RESULT } from "@/helpers/constants";
import { cn } from "@/helpers/utils";
import { useAuth } from "@/hooks/useAuth";
import useQueryParams from "@/hooks/useQueryParams";
import PostService from "@/services/PostService";
import { Spinner, Typography } from "@material-tailwind/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { useInView } from "react-intersection-observer";

const Overview: React.FC = () => {
  const { user } = useAuth();
  const { ref, inView } = useInView();
  const filter = useQueryParams().get("filter") ?? "New";

  const { data, fetchNextPage, isPending, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["POST_LIST", "OVERVIEW", user?.username, { filter }],
      queryFn: async ({ pageParam = 1 }) => {
        try {
          return await PostService.getPostsInProfile(
            user!.username,
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
      enabled: !!user
    });
  React.useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);
  if (!user || isPending) {
    return <Spinner className="mx-auto" />;
  }
  const posts = data?.pages.flatMap(p => p) ?? [];
  return (
    <ContentLayout>
      <div
        className={cn(
          "flex justify-center",
          (posts?.length ?? 0) > 0 && "hidden"
        )}
      >
        <Typography className="text-sm capitalize font-semibold">
          Hasn't posts yet
        </Typography>
      </div>

      {posts.length > 0 && (
        <div>
          {posts?.map((post, index) => (
            <div key={index}>
              <div className="hover:bg-gray-50 rounded-lg w-full cursor-pointer">
                <PostItem key={index} data={post} />
              </div>
              <hr className="my-1 border-blue-gray-50" />
            </div>
          ))}
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
      )}
    </ContentLayout>
  );
};
export default Overview;
