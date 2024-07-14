import React from "react";
import Content from "./Content";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { cn } from "@/helpers/utils";
import { Drawer } from "@material-tailwind/react";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const openSidebar = React.useCallback(() => setIsSidebarOpen(true), []);
  const closeSidebar = React.useCallback(() => setIsSidebarOpen(false), []);
  return (
    <>
      <div className="sticky top-0 z-30 w-full">
        <Header openSidebar={openSidebar} />
      </div>
      <div
        className={cn(
          "fixed left-0 hidden xl:block max-w-[18rem] h-[calc(100vh-3.25rem)]"
        )}
      >
        <Sidebar />
      </div>
      <div className="flex flex-col items-center">
        <div className="max-w-screen-md w-full lg:w-3/4 xl:w-1/2 py-2">
          <Content />
        </div>
      </div>
      <Drawer open={isSidebarOpen} onClose={closeSidebar}>
        <Sidebar handleClose={closeSidebar} />
      </Drawer>
    </>
  );
};
export default Layout;
