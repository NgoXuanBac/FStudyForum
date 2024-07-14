import { Roles } from "@/helpers/constants";
import { cn } from "@/helpers/utils";
import { useAuth } from "@/hooks/useAuth";
import DefaultTopic from "@/assets/images/topic.png";

import {
  List,
  ListItem,
  ListItemPrefix,
  Card,
  AccordionBody,
  AccordionHeader,
  Typography,
  Accordion,
  Dialog
} from "@material-tailwind/react";
import {
  Album,
  Layers3,
  AreaChart,
  BookUser,
  ChevronDown,
  Home,
  Rocket,
  SquareGanttChart,
  Flag,
  HandCoins,
  Tags,
  Plus
} from "lucide-react";
import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CreateFeedForm from "../feed/CreateFeedForm";

interface SubItem {
  label: string;
  icon?: JSX.Element;
  items?: SubItem[];
  path?: string;
  handle?: () => void;
}

interface SidebarGroup {
  group: string;
  disable?: boolean;
  items?: SubItem[];
}

type SidebarProps = {
  handleClose?: () => void;
};

const Popups = {
  CREATE_FEED: 0
};

const Sidebar = React.memo(({ handleClose }: SidebarProps) => {
  const [openPopup, setOpenPopup] = React.useState(-1);
  const switchOpenFeed = () =>
    setOpenPopup(pre => (pre == -1 ? Popups.CREATE_FEED : -1));

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();

  const [collapse, setCollapse] = React.useState<string[]>([]);

  const toggleLabel = (label: string) => {
    setCollapse(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isCollapse = (label: string) => collapse.includes(label);

  const handleView = (path: string) => {
    handleClose?.();
    navigate(path);
  };

  const sidebarItems: SidebarGroup[] = useMemo(
    () => [
      {
        group: "user",
        items: [
          {
            label: "Home",
            icon: <Home className="w-5 h-5" />,
            path: "/home"
          },
          {
            label: "Popular",
            icon: <Rocket className="w-5 h-5" />,
            path: "/popular"
          },
          {
            label: "Topics",
            icon: <Tags className="w-5 h-5" />,
            path: "/topics"
          },
          {
            label: "Donate",
            icon: <HandCoins className="w-5 h-5" />,
            path: "/donate"
          }
        ]
      },
      {
        group: "moderator",
        disable: !!user?.mods.length == false,
        items: [
          {
            label: "Moderator",
            handle: () => toggleLabel("Moderator"),
            items: user?.mods.map<SubItem>(topic => {
              return {
                label: `t/${topic.name}`,
                icon: (
                  <img
                    src={topic.avatar || DefaultTopic}
                    className="w-5 h-5 rounded-full"
                  />
                ),
                handle: () => console.log("test")
              };
            })
          }
        ]
      },
      {
        group: "feed",
        items: [
          {
            label: "Custom feed",
            handle: () => toggleLabel("Custom feed"),
            items: [
              {
                label: "Create a custom feed",
                icon: <Plus className="w-5 h-5" />,
                handle: () => switchOpenFeed()
              }
            ]
          }
        ]
      },
      {
        group: "admin",
        disable: !!user?.roles.some(r => [Roles.ADMIN].includes(r)) == false,
        items: [
          {
            label: "Manager",
            icon: <SquareGanttChart className="w-5 h-5" />,
            handle: () => toggleLabel("Manager"),
            items: [
              {
                label: "Analytics",
                icon: <AreaChart className="w-5 h-5" />,
                path: "/manager/analytics"
              },
              {
                label: "Members",
                icon: <BookUser className="w-5 h-5" />,
                path: "/manager/members"
              },
              {
                label: "Topics",
                icon: <Album className="w-5 h-5" />,
                path: "/manager/topics"
              },
              {
                label: "Categories",
                icon: <Layers3 className="w-5 h-5" />,
                path: "/manager/categories"
              },
              {
                label: "Report",
                icon: <Flag className="w-5 h-5" />,
                path: "/manager/report"
              }
            ]
          }
        ]
      }
    ],
    [user?.mods, user?.roles]
  );
  if (!user) return;

  return (
    <>
      <Card
        color="transparent"
        className={cn(
          "w-full h-full rounded-none shadow-sm shadow-blue-gray-900/5 border-r",
          "text-blue-gray-700 overflow-y-auto scrollbar"
        )}
      >
        {sidebarItems.map(
          ({ group, items, disable }) =>
            !disable && (
              <div key={group}>
                <List>
                  {items &&
                    items.map(({ label, icon, path, handle, items }) =>
                      !items ? (
                        <ListItem
                          onClick={e => {
                            e.stopPropagation();
                            path ? handleView(path) : handle && handle();
                          }}
                          selected={pathname === path}
                          key={label}
                          className={cn("text-sm")}
                        >
                          <ListItemPrefix>{icon}</ListItemPrefix>
                          {label}
                        </ListItem>
                      ) : (
                        <Accordion
                          key={label}
                          open={!isCollapse(label)}
                          icon={
                            <ChevronDown
                              className={`mx-auto h-4 w-4 transition-transform ${
                                !isCollapse(label) ? "rotate-180" : ""
                              }`}
                            />
                          }
                        >
                          <AccordionHeader
                            onClick={() => handle && handle()}
                            className="border-b-0 p-3 hover:bg-blue-gray-50 rounded-md"
                          >
                            <Typography className="mr-auto text-xs uppercase tracking-widest">
                              {label}
                            </Typography>
                          </AccordionHeader>
                          <AccordionBody className="py-1">
                            {items && items.length > 0 && (
                              <List className="p-0 text-sm">
                                {items.map(({ label, icon, handle, path }) => (
                                  <ListItem
                                    onClick={e => {
                                      e.stopPropagation();
                                      path
                                        ? handleView(path)
                                        : handle && handle();
                                    }}
                                    selected={pathname === path}
                                    key={label}
                                    className="text-sm"
                                  >
                                    <ListItemPrefix>{icon}</ListItemPrefix>
                                    {label}
                                  </ListItem>
                                ))}
                              </List>
                            )}
                          </AccordionBody>
                        </Accordion>
                      )
                    )}
                </List>
                <hr className=" border-blue-gray-50" />
              </div>
            )
        )}
      </Card>
      <Dialog
        className="w-[32rem] p-2"
        open={openPopup == Popups.CREATE_FEED}
        handler={switchOpenFeed}
      >
        <CreateFeedForm handler={switchOpenFeed} />
      </Dialog>
    </>
  );
});

export default Sidebar;
