import React from "react";
import SearchService from "@/services/SearchService";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LIMIT_SCROLLING_PAGNATION_RESULT } from "@/helpers/constants";
import NotFoundSearch from "@/components/layout/NotFoundSearch";
import { Avatar, Spinner } from "@material-tailwind/react";
import { Link, useLocation } from "react-router-dom";
import DefaultUser from "@/assets/images/user.png";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchUserPage: React.FC = () => {
  const { ref, inView } = useInView();
  const query = useQuery();
  const keyword = query.get("keyword") ?? "";

  const { data, fetchNextPage, isPending, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["PEOPLE_LIST", "SEARCH", { keyword }],
      queryFn: async ({ pageParam = 1 }) => {
        try {
          return await SearchService.searchUsers(
            keyword || "",
            pageParam,
            LIMIT_SCROLLING_PAGNATION_RESULT
          );
        } catch (e) {
          return [];
        }
      },
      getNextPageParam: (last, pages) =>
        last.length ? pages.length + 1 : undefined,
      initialPageParam: 1
    });
  const users = data?.pages.flatMap(page => page) ?? [];

  React.useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const uniqueTopics = Array.from(new Set(users.map(t => t.username))).map(
    name => users.find(t => t.username === name)
  );

  if (isPending) return <Spinner className="mx-auto" />;
  if (uniqueTopics.length === 0) return <NotFoundSearch keyword={keyword} />;
  return (
    <>
      {uniqueTopics.map((user, index) => {
        return (
          <Link to={`/user/${user?.username}`} key={user?.username}>
            <div key={index} className="w-full flex flex-col item-center">
              <div className="hover:bg-gray-100 rounded-lg w-full p-4 gap-x-4 flex items-center text-blue-gray-800">
                <Avatar
                  src={user?.avatar || DefaultUser}
                  className="w-10 h-10"
                />
                <div>
                  <h3 className="font-semibold mb-1">u/{user?.username}</h3>
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

export default SearchUserPage;
