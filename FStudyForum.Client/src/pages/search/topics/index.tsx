import React from "react";
import SearchService from "@/services/SearchService";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LIMIT_SCROLLING_PAGNATION_RESULT } from "@/helpers/constants";
import NotFoundSearch from "@/components/layout/NotFoundSearch";
import { Avatar, Spinner } from "@material-tailwind/react";
import { Link, useLocation } from "react-router-dom";
import DefaultTopic from "@/assets/images/topic.png";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchTopicPage: React.FC = () => {
  const { ref, inView } = useInView();

  const query = useQuery();
  const keyword = query.get("keyword") ?? "";

  const { data, fetchNextPage, isPending, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["TOPIC_LIST", "SEARCH", { keyword }],
      queryFn: async ({ pageParam = 1 }) => {
        try {
          return await SearchService.searchTopics(
            keyword || "",
            pageParam,
            LIMIT_SCROLLING_PAGNATION_RESULT
          );
        } catch {
          return [];
        }
      },
      getNextPageParam: (last, pages) =>
        last.length ? pages.length + 1 : undefined,
      initialPageParam: 1
    });

  const topics = data?.pages.flatMap(page => page) ?? [];

  React.useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const uniqueTopics = Array.from(new Set(topics.map(t => t.id))).map(id =>
    topics.find(t => t.id === id)
  );

  if (isPending) return <Spinner className="mx-auto" />;
  if (uniqueTopics.length === 0) return <NotFoundSearch keyword={keyword} />;
  return (
    <>
      {uniqueTopics.map(topic => {
        if (!topic) return null;

        return (
          <Link to={`/topic/${topic.name}`} key={topic.id}>
            <div className="w-full flex flex-col item-center">
              <div className="hover:bg-gray-100 rounded-lg w-full p-4 flex gap-x-4 items-center text-blue-gray-800">
                <Avatar
                  src={topic.avatar || DefaultTopic}
                  className="w-10 h-10"
                />
                <div className="flex flex-col gap-y-1">
                  <h3 className="font-semibold text-sm">t/{topic.name}</h3>
                  <p className="text-gray-600 text-xs">{topic.description}</p>
                </div>
              </div>
              <hr className="my-1 border-blue-gray-50 w-full" />
            </div>
          </Link>
        );
      })}
      <div ref={ref} className="text-center">
        {isFetchingNextPage ? (
          <Spinner className="mx-auto" />
        ) : (
          !isPending && <span className="text-xs font-light">Nothing more</span>
        )}
      </div>
    </>
  );
};

export default SearchTopicPage;
