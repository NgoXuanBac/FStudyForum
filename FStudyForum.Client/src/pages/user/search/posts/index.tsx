import React from "react";
import SearchService from "@/services/SearchService";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LIMIT_SCROLLING_PAGNATION_RESULT } from "@/helpers/constants";
import NotFoundSearch from "@/components/layout/NotFoundSearch";
import { Spinner } from "@material-tailwind/react";

import useSearchParam from "@/hooks/useSearchParam";
import PostFilter from "@/components/post/PostFilter";
import SearchPost from "@/components/search/SearchPost";
import useQueryParams from "@/hooks/useQueryParams";
import { useParams } from "react-router-dom";

const SearchPostPage = () => {
  const [filter, setFilter] = useSearchParam<string>({
    key: "filter",
    defaultValue: "New"
  });
  const { username } = useParams<{ username: string }>();
  const { ref, inView } = useInView();

  const keyword = useQueryParams().get("keyword");

  const { data, fetchNextPage, isPending, isFetchingNextPage, error } =
    useInfiniteQuery({
      queryKey: [
        "POST_LIST",
        "SEARCH",
        "BY_USER",
        username,
        { keyword, filter }
      ],
      queryFn: async ({ pageParam = 1 }) => {
        try {
          const result = await SearchService.searchPostByKeywordInUser(
            keyword || "",
            pageParam,
            LIMIT_SCROLLING_PAGNATION_RESULT,
            filter,
            username || ""
          );

          return result;
        } catch (error) {
          return [];
        }
      },
      getNextPageParam: (_, pages) => pages.length + 1,
      initialPageParam: 1
    });

  const posts = data?.pages.flatMap(p => p) ?? [];

  React.useEffect(() => {
    if (inView && !error) {
      fetchNextPage();
    }
  }, [inView, error, fetchNextPage]);

  if (isPending) return <Spinner className="mx-auto" />;

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

export default SearchPostPage;
