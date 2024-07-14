import { useRouterParam } from "@/hooks/useRouterParam";

const TopicDescription = () => {
  const { topic } = useRouterParam();

  return (
    <>
      <div className="p-4 border-b-2 ">
        <h1 className="font-semibold truncate text-sm text-black">
          t/{topic?.name}
        </h1>
        <p className="text-xs font-light">{topic?.description}</p>
      </div>
      <div className="p-4 border-b-2">
        <h1 className="text-xs uppercase">Moderators</h1>
      </div>
    </>
  );
};

export default TopicDescription;
