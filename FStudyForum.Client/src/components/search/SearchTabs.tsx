import { cn } from "@/helpers/utils";
import useQueryParams from "@/hooks/useQueryParams";
import { useNavigate } from "react-router-dom";

const SearchTabs = () => {
  const pathSegments = location.pathname.split("/");
  const tabs = pathSegments[pathSegments.length - 1];
  const keyword = useQueryParams().get("keyword");
  const navigate = useNavigate();

  const handleClick = (type: string) => {
    navigate(`/search/${type}?keyword=${keyword}`);
  };
  const SearchMenu = [
    {
      path: "posts",
      title: "Posts"
    },
    {
      path: "topics",
      title: "Topics"
    },
    {
      path: "comments",
      title: "Comments"
    },
    {
      path: "people",
      title: "People"
    }
  ];

  return (
    <>
      {SearchMenu.map(({ title, path }) => (
        <button
          key={path}
          onClick={() => {
            if (tabs != path) return handleClick(path);
          }}
          className={cn(
            "mb-2 relative flex gap-x-1 justify-center items-center py-2 px-4  text-sm text-black-800 rounded-full",
            tabs == path && "bg-blue-gray-50"
          )}
        >
          {title}
        </button>
      ))}
    </>
  );
};

export default SearchTabs;
