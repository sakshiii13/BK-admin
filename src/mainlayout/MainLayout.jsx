import React from "react";
import SideBar from "../components/ui/SideBar";
import TopBar from "../components/ui/TopBar";

const MainLayout = ({ inner }) => {
  return (
    <div className="flex">
      <SideBar />
      <div className={`lg:w-[calc(100%-15rem)] w-full`}>
        <TopBar />
        <div className="p-2 ">{inner}</div>
      </div>
    </div>
  );
};

export default MainLayout;
