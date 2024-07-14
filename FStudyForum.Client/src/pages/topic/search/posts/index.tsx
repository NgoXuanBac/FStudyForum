import React from "react";
import { Spinner } from "@material-tailwind/react";
import { useRouterParam } from "@/hooks/useRouterParam";
import useSearchParam from "@/hooks/useSearchParam";
import PostFilter from "@/components/post/PostFilter";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LIMIT_SCROLLING_PAGNATION_RESULT } from "@/helpers/constants";
import { useInView } from "react-intersection-observer";
import SearchPost from "@/components/search/SearchPost";
import useQueryParams from "@/hooks/useQueryParams";
import NotFoundSearch from "@/components/layout/NotFoundSearch";
import SearchService from "@/services/SearchService";
const SearchPostInTopic: React.FC = () => {
  const { topic } = useRouterParam();
  const [filter, setFilter] = useSearchParam<string>({
    key: "filter",
    defaultValue: "New"
  });

  const queryParams = useQueryParams();
  const keyword = queryParams.get("keyword") ?? "";

  const { ref, inView } = useInView();

  const { data, fetchNextPage, isPending, isFetchingNextPage, refetch } =
    useInfiniteQuery({
      queryKey: [
        "POST_LIST",
        "SEARCH",
        "BY_TOPIC",
        topic?.name,
        { keyword, filter }
      ],
      queryFn: async ({ pageParam = 1 }) => {
        try {
          const posts = await SearchService.searchPostsByKeywordInTopic(
            topic!.name,
            pageParam,
            LIMIT_SCROLLING_PAGNATION_RESULT,
            filter,
            keyword
          );
          return posts;
        } catch (e) {
          return [];
        }
      },
      getNextPageParam: (_, pages) => pages.length + 1,
      initialPageParam: 1,
      enabled: !!topic
    });
  React.useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);
  React.useEffect(() => {
    refetch();
  }, [keyword, refetch]);
  if (!topic || isPending) {
    return <Spinner className="mx-auto" />;
  }
  const posts = data?.pages.flatMap(p => p) ?? [];

  return (
    <>
      {posts.length === 0 || !keyword ? (
        <NotFoundSearch keyword={keyword} />
      ) : (
        <>
          <div className="relative flex text-left z-20">
            <PostFilter setFilter={setFilter} filter={filter} />
          </div>
          {posts.map((post, index) => (
            <div key={index} className="w-full">
              <div className="hover:bg-gray-50 rounded-lg w-full p-2">
                <SearchPost key={index} data={post} keyword={keyword} />
              </div>
              <hr className="my-1 border-blue-gray-50" />
            </div>
          ))}
          <div ref={ref} className="text-center">
            {isFetchingNextPage && <Spinner className="mx-auto" />}
          </div>
        </>
      )}
    </>
  );
};

export default SearchPostInTopic;
