import { useState, useEffect } from "react";
import AddTopicPopup from "@/components/topic/popup/AddTopicPopup";
import DeleteTopicPopup from "@/components/topic/popup/DeleteTopicPopup";
import UpdateTopicPopup from "@/components/topic/popup/UpdateTopicPopup";
import { cn } from "@/helpers/utils";
import TopicService from "@/services/TopicService";
import CategoryService from "@/services/CategoryService";
import { Topic } from "@/types/topic";
import { Category } from "@/types/category";
import {
  useQuery,
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  IconButton,
  Tooltip
} from "@material-tailwind/react";
import {
  ChevronsUpDown,
  Pencil,
  Plus,
  Trash,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const titles = ["Name", "Description", "Action"];
const PAGE_SIZE = 5;

const queryClient = new QueryClient();

const TopicsPage = () => {
  const [popupOpen, setPopupOpen] = useState(0);
  const [selectTopic, setSelectTopic] = useState<Topic | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryObjects: Category[] =
          await CategoryService.getAllCategory();
        setCategories(categoryObjects);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const { data, isLoading, refetch } = useQuery<Topic[], Error>({
    queryKey: ["TOPIC_LIST", { selectedCategory }],
    queryFn: () => {
      if (selectedCategory) {
        return TopicService.filterByCategories([Number(selectedCategory)]);
      } else {
        return TopicService.getActiveTopics();
      }
    }
  });

  const totalPages = Math.ceil((data?.length ?? 0) / PAGE_SIZE);

  const paginatedData = data?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const openAddPopup = () => setPopupOpen(1);
  const openEditPopup = (topic: Topic) => {
    setSelectTopic(topic);
    setPopupOpen(2);
  };
  const openDeletePopup = (topic: Topic) => {
    setSelectTopic(topic);
    setPopupOpen(3);
  };
  const closePopup = () => setPopupOpen(0);

  const reloadTopics = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error("Error refetching topics:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectTopic) return;
    try {
      await TopicService.deleteTopic(selectTopic.name);
      closePopup();
      await refetch();
    } catch (error) {
      console.error("Error deleting topic:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <>
        <Card className="h-full w-full">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-4 flex items-center justify-between gap-8">
              <div>
                <Typography variant="h5" color="blue-gray">
                  Topic list
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  See information about all topics
                </Typography>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="gradient"
                  className="flex items-center gap-2 capitalize text-sm"
                  color="orange"
                  onClick={openAddPopup}
                >
                  <Plus strokeWidth={3} className="h-4 w-4" /> Add
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardBody className="overflow-y-hidden px-0">
            <select
              value={selectedCategory ?? ""}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-1 text-sm rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All</option>
              {categories.map(category => (
                <option key={category.id} value={String(category.id)}>
                  {category.name}
                </option>
              ))}
            </select>
            <table className="mt-4 w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {titles.map((head, index) => (
                    <th
                      key={head}
                      className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                      >
                        {head}{" "}
                        {index !== titles.length - 1 && (
                          <ChevronsUpDown strokeWidth={2} className="h-4 w-4" />
                        )}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={cn(isLoading && "hidden")}>
                {paginatedData?.map((topic, index) => {
                  const isLast = index === paginatedData.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";
                  return (
                    <tr key={topic.name}>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {topic.name}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={`${classes} break-words max-w-60`}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal opacity-70"
                        >
                          {topic.description}
                        </Typography>
                      </td>
                      <td className={cn(classes)}>
                        <Tooltip content="Edit topic">
                          <IconButton
                            variant="text"
                            onClick={() => openEditPopup(topic)}
                          >
                            <Pencil className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip content="Delete topic">
                          <IconButton
                            variant="text"
                            onClick={() => openDeletePopup(topic)}
                          >
                            <Trash className="h-4 w-4 text-red-400" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-1 text-sm bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4 inline" />
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 mx-1 text-sm rounded ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 mx-1 text-sm bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4 inline" />
              </button>
            </div>
          </CardBody>
        </Card>
        {popupOpen === 1 && (
          <AddTopicPopup onClose={closePopup} onTopicCreated={reloadTopics} />
        )}

        {popupOpen === 2 && selectTopic && (
          <UpdateTopicPopup
            open={true}
            topic={selectTopic}
            onClose={closePopup}
            onUpdate={reloadTopics}
          />
        )}

        {popupOpen === 3 && selectTopic && (
          <DeleteTopicPopup
            open={true}
            onClose={closePopup}
            onDelete={handleDelete}
          />
        )}
      </>
    </QueryClientProvider>
  );
};

export default TopicsPage;
