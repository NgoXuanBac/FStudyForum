import { cn } from "@/helpers/utils";
import useOutsideClick from "@/hooks/useOutsideClick";
import { ChevronUp } from "lucide-react";
import React from "react";

interface Props {
  setFilter: (filter: string) => void;
  filter: string;
}

const PostFilter: React.FC<Props> = ({ setFilter, filter }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const filterMenu = [{ name: "New" }, { name: "Hot" }];
  const ref = useOutsideClick(() => setIsOpen(false));
  return (
    <div ref={ref} className="w-full">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="relative flex gap-x-1 justify-center items-center p-2 text-xs text-gray-700 bg-white hover:bg-blue-gray-50 rounded-full"
      >
        {isOpen ? "Sort by" : filter}
        <ChevronUp
          className={`mx-auto w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="origin-top-left absolute top-9 shadow-sm bg-white rounded-md overflow-hidden border">
          <div
            className={cn(
              "block px-4 py-2 text-sm text-gray-700 font-semibold truncate"
            )}
          >
            Sort by
          </div>
          {filterMenu.map(({ name }) => (
            <div
              key={name}
              className={cn(
                "block p-4 text-sm text-gray-700 hover:bg-blue-gray-50/50 cursor-pointer",
                filter === name && "bg-blue-gray-50"
              )}
              onClick={() => {
                setFilter(name);
                setIsOpen(false);
              }}
            >
              {name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostFilter;
