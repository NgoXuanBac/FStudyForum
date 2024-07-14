import { useState, useEffect } from "react";
import AddCategoryPopup from "@/components/category/Add";
import DeleteCategoryPopup from "@/components/category/Delete";
import UpdateCategoryPopup from "@/components/category/Update";
import { cn } from "@/helpers/utils";
import { Category } from "@/types/category";
import { useQuery } from "@tanstack/react-query";
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
import CategoryService from "@/services/CategoryService";
import CategoryTypeService from "@/services/CategoryTypeService";

const titles = ["Name", "Description", "Types", "Action"];
const PAGE_SIZE = 5;

const CategoriesPage = () => {
  const [popupOpen, setPopupOpen] = useState(0);
  const [selectCategory, setSelectCategory] = useState<Category | undefined>(
    undefined
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState<string | undefined>(
    undefined
  );
  const [categoryTypes, setCategoryTypes] = useState<Array<string>>([]);
  const [sortColumn, setSortColumn] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchCategoryTypes = async () => {
      try {
        const types = await CategoryTypeService.getAll();
        setCategoryTypes(types);
      } catch (error) {
        console.error("Error fetching category types:", error);
      }
    };

    fetchCategoryTypes();
  }, []);

  const { data, isLoading, refetch } = useQuery<Category[], Error>({
    queryKey: ["CATEGORY_LIST"],
    queryFn: async () => {
      const categories = await CategoryService.getAllCategory();
      return categories;
    }
  });

  const sortedData = [...(data ?? [])]
    .filter(category =>
      selectedType
        ? category.type.toLowerCase().startsWith(selectedType.toLowerCase())
        : true
    )
    .sort((a, b) => {
      const aValue = a[sortColumn as keyof Category] as string;
      const bValue = b[sortColumn as keyof Category] as string;

      return (
        aValue.localeCompare(bValue, undefined, {
          numeric: true,
          sensitivity: "base"
        }) * (sortDirection === "asc" ? 1 : -1)
      );
    });

  const totalPages = Math.ceil(sortedData.length / PAGE_SIZE);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const openAddPopup = () => setPopupOpen(1);
  const openEditPopup = (category: Category) => {
    setSelectCategory(category);
    setPopupOpen(2);
  };

  const openDeletePopup = (category: Category) => {
    setSelectCategory(category);
    setPopupOpen(3);
  };

  const closePopup = () => setPopupOpen(0);

  const reloadCategory = () => {
    refetch();
  };

  const handleDelete = async () => {
    if (!selectCategory) return;
    try {
      await CategoryService.deleteCategory(selectCategory.name);
      closePopup();
      reloadCategory();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      const newPageIndex = newPage - 1;
      const startIndex = newPageIndex * PAGE_SIZE;

      if (
        sortedData.length > 0 &&
        startIndex + PAGE_SIZE <= sortedData.length
      ) {
        setCurrentPage(newPage);
      } else {
        const lastPage = Math.ceil(sortedData.length / PAGE_SIZE);
        setCurrentPage(lastPage);
      }
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Categories list
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                See information about all categories
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
          <div className="flex items-center gap-4 mt-4">
            <select
              value={selectedType ?? ""}
              onChange={e => setSelectedType(e.target.value || undefined)}
              className="px-3 py-1 text-sm rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              {categoryTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {titles.map((head, index) => (
                  <th
                    key={head}
                    onClick={() => handleSort(head.toLowerCase())}
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                      {head}
                      {index !== titles.length - 1 && (
                        <ChevronsUpDown strokeWidth={2} className="h-4 w-4" />
                      )}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={cn(isLoading && "hidden")}>
              {paginatedData.map((category, index) => {
                const isLast = index === paginatedData.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={category.name}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {category.name}
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
                        {category.description}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {category.type}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Edit category">
                        <IconButton
                          variant="text"
                          onClick={() => openEditPopup(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip content="Delete category">
                        <IconButton
                          variant="text"
                          onClick={() => openDeletePopup(category)}
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
        </CardBody>
      </Card>
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
      {popupOpen === 1 && (
        <AddCategoryPopup
          onClose={closePopup}
          onCategoryCreated={reloadCategory}
          open={true}
        />
      )}

      {popupOpen === 2 && selectCategory && (
        <UpdateCategoryPopup
          open={true}
          category={selectCategory}
          onClose={closePopup}
          onUpdate={reloadCategory}
        />
      )}

      {popupOpen === 3 && selectCategory && (
        <DeleteCategoryPopup
          open={true}
          onClose={closePopup}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};

export default CategoriesPage;
