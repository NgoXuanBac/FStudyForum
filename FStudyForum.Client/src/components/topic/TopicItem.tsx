import React from "react";
import { Avatar, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import type { Topic } from "@/types/topic";

interface TopicProps {
  topic: Topic;
}

const TopicItem: React.FC<TopicProps> = ({ topic }) => {
  return (
    <Link
      to={`/topic/${topic.name}`}
      className="border border-gray-300 rounded-lg p-2"
    >
      <div className="mb-2 flex items-center gap-2">
        <Avatar
          variant="circular"
          size="sm"
          className="bg-white"
          src={topic.avatar || "/src/assets/images/defaultTopic.png"}
        />
        <div className="flex-col flex">
          <span className="text-sm font-normal">{`t/${topic.name}`}</span>
          <span className="text-xs font-light self-start">
            {`${topic.postCount}`}
            {topic.postCount > 1 ? " posts" : " post"}
          </span>
        </div>
      </div>
      <Typography className="text-xs  truncate break-words">
        {topic.description}
      </Typography>
    </Link>
  );
};

export default TopicItem;
