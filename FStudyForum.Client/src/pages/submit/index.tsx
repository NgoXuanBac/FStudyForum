import { cn } from "@/helpers/utils";
import { Topic } from "@/types/topic";
import { Avatar, Button, Input, Spinner } from "@material-tailwind/react";
import { ChevronDown, Search } from "lucide-react";
import React, { ChangeEvent } from "react";
import DefaultTopic from "@/assets/images/topic.png";
import DefaultUser from "@/assets/images/user.png";

import useOutsideClick from "@/hooks/useOutsideClick";
import ContentLayout from "@/components/layout/ContentLayout";
import Editor from "@/components/post/Editor";
import { useRouterParam } from "@/hooks/useRouterParam";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import TopicService from "@/services/TopicService";
import { useAuth } from "@/hooks/useAuth";

export type Context = {
  prefix: string;
  name: string;
  avatar: string;
};

const SubmitPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [keyword, setKeyword] = React.useState("");
  const [foundTopics, setFoundTopics] = React.useState<Topic[]>([]);
  const { topic, user: profile } = useRouterParam();
  const searchRef = useOutsideClick(() => closeOpenSearch());
  const [openSearch, setOpenSearch] = React.useState(false);

  const context: Context | undefined = React.useMemo(() => {
    if (topic)
      return {
        prefix: "t",
        name: topic.name,
        avatar: topic.avatar || DefaultTopic
      };
    if (profile)
      return {
        prefix: "u",
        name: profile.username,
        avatar: profile.avatar || DefaultUser
      };
    return undefined;
  }, [topic, profile]);

  const debouncedSearch = React.useMemo(
    () =>
      debounce(async (searchTerm: string) => {
        if (!searchTerm) {
          setFoundTopics([]);
          return;
        }
        try {
          const founds = await TopicService.search(searchTerm);
          setFoundTopics(founds);
        } catch (e) {
          setFoundTopics([]);
        }
      }, 200),
    []
  );

  const closeOpenSearch = () => {
    setOpenSearch(false);
    setFoundTopics([]);
    setSelectedIndex(-1);
  };

  const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedIndex(-1);
    setKeyword(event.target.value.trim());
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        setSelectedIndex(prevIndex =>
          prevIndex > 0 ? prevIndex - 1 : foundTopics.length - 1
        );
        break;
      case "ArrowDown":
        event.preventDefault();
        setSelectedIndex(prevIndex =>
          prevIndex < foundTopics.length - 1 ? prevIndex + 1 : 0
        );
        break;
      case "Enter":
        if (selectedIndex !== -1) {
          if (foundTopics.length != 0)
            handleSelect("t", foundTopics[selectedIndex].name);
          else handleSelect("u", user!.username);
        }
        break;
    }
  };

  const handleSelect = async (prefix: string, target: string) => {
    navigate(`/${prefix == "t" ? "topic" : "user"}/${target}/submit`);
    closeOpenSearch();
  };

  React.useEffect(() => {
    const trimmedKeyword = keyword.replace(/^t\//, "");
    debouncedSearch(trimmedKeyword);
    return () => {
      debouncedSearch.cancel();
    };
  }, [keyword, debouncedSearch]);

  if (!user) return <Spinner className="mx-auto" />;

  return (
    <ContentLayout>
      <div className="mb-6">
        <p className="text-md font-semibold flex gap-x-2 items-center">
          Create post
        </p>
        <p className="text-xs text-gray-600 text-left">
          Do you want to share knowledge or ask a new question?
        </p>
      </div>
      <div className="w-64 max-w-screen-md relative" ref={searchRef}>
        {!openSearch ? (
          <Button
            className="rounded-full bg-gray-200 normal-case flex items-center gap-x-2 !p-2"
            variant="text"
            onClick={() => setOpenSearch(true)}
          >
            <Avatar src={context?.avatar || DefaultTopic} className="w-6 h-6" />
            <span className="text-sm font-normal">
              {context ? `${context.prefix}/${context.name}` : "Select a topic"}
            </span>
            <div className="px-2">
              <ChevronDown className="w-4 h-4" strokeWidth={2.2} />
            </div>
          </Button>
        ) : (
          <>
            <Input
              autoFocus
              onChange={handleSearch}
              labelProps={{
                className: "hidden"
              }}
              icon={<Search className="h-4 w-4" strokeWidth={2.2} />}
              placeholder="Select a topic"
              containerProps={{ className: "min-w-full" }}
              crossOrigin={undefined}
              className={cn(
                "placeholder:text-gray-500 placeholder:opacity-100 pl-6 ",
                "rounded-full !border-0 !bg-gray-200 text-gray-900"
              )}
              value={keyword}
              onKeyDown={handleKeyDown}
            />
            <div className="absolute top-12 w-full bg-white rounded-md border shadow-lg shadow-gray-900/5 max-h-80 overflow-y-auto z-30">
              {!keyword && (
                <>
                  <div className="text-xs font-semibold px-2 py-4 text-gray-600 uppercase">
                    Your profile
                  </div>
                  <div
                    className={cn(
                      "hover:bg-gray-200 rounded-none normal-case flex items-center gap-x-2 p-2 w-full text-gray-900 cursor-pointer",
                      selectedIndex == 0 ? "bg-gray-200" : ""
                    )}
                    onClick={() => handleSelect("u", user.username)}
                  >
                    <Avatar
                      src={user.avatar || DefaultUser}
                      className="w-8 h-8"
                    />
                    <div className="flex-col flex">
                      <span className="text-xs font-normal">{`u/${user.username}`}</span>
                    </div>
                  </div>
                </>
              )}
              {keyword &&
                (foundTopics.length != 0 ? (
                  <div className="text-xs font-semibold px-2 py-4 text-gray-600 uppercase">
                    Others
                  </div>
                ) : (
                  <div className="text-sm p-4 text-gray-600">
                    No topics found
                  </div>
                ))}

              {foundTopics.map((topic, index) => (
                <div
                  key={topic.name}
                  className={cn(
                    "hover:bg-gray-200 rounded-none normal-case flex items-center gap-x-2 !p-2 w-full cursor-pointer",
                    index === selectedIndex ? "bg-gray-200" : ""
                  )}
                  onClick={() => handleSelect("t", topic.name)}
                >
                  <Avatar
                    src={topic.avatar || DefaultTopic}
                    className="w-8 h-8"
                  />
                  <div className="flex-col flex">
                    <span className="text-xs font-normal">{`t/${topic.name}`}</span>
                    <span className="text-[0.7rem] font-light self-start">
                      {`${topic.postCount}`}
                      {topic.postCount > 1 ? " posts" : " post"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="my-4" />
      <Editor context={context} />
    </ContentLayout>
  );
};

export default SubmitPage;
