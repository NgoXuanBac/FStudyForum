import React from "react";
import TopicItem from "@/components/topic/TopicItem";
import TopicService from "@/services/TopicService";
import { Topic as TopicType } from "@/types/topic";
import { Spinner } from "@material-tailwind/react";

const TopicsPage: React.FC = () => {
  const [topics, setTopics] = React.useState<TopicType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const data = await TopicService.getActiveTopics();
        setTopics(data);
      } catch (error) {
        setError("Failed to fetch topics");
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  if (loading) return <Spinner className="mx-auto" />;
  if (error) return <div>{error}</div>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {topics.map(topic => (
        <TopicItem key={topic.id} topic={topic} />
      ))}
    </div>
  );
};

export default TopicsPage;
