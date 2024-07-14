import { FC } from "react";

type NotFoundProps = {
  keyword: string | null;
};
const NotFoundSearch: FC<NotFoundProps> = ({ keyword }) => {
  return (
    <>
      <div className="w-full flex flex-col item-center">
        <div className="rounded-lg w-full py-6 gap-x-2 flex">
          <img src="http://bit.ly/3Lbxusd" alt="Not Found" className="w-14" />
          <div>
            <h3 className="font-semibold mb-1">
              Hm... we couldn’t find any results for "{keyword}"
            </h3>
            <p className="text-gray-600 text-sm">
              Double-check your spelling or try different keywords to adjust
              your search
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundSearch;
