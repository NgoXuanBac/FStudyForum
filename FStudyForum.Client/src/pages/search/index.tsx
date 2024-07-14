import ContentLayout from "@/components/layout/ContentLayout";
import SearchTabs from "@/components/search/SearchTabs";
import { Outlet } from "react-router-dom";

const Search = () => {
  return (
    <ContentLayout>
      <div className="relative flex text-left z-20 mt-3">
        <SearchTabs />
      </div>
      <Outlet />
    </ContentLayout>
  );
};

export default Search;
