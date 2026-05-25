import React from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../components/ui/SideBar";
import TopBar from "../components/ui/TopBar";
import { toggleSideMenu } from "../redux/slices/sideBarMenuSlice";

const MainLayout = ({ inner }) => {
  const dispatch = useDispatch();
  const sideToggle = useSelector((state) => state?.sideMenu?.open);

  return (
    <div className="flex min-h-screen bg-[var(--app-bg)] text-white">
      <SideBar />
      <div 
        className={`w-full min-h-screen flex flex-col transition-all duration-300 ease-in-out
          ${sideToggle ? "lg:w-[calc(100%-260px)]" : "lg:w-full"}`}
      >
        <TopBar onMenuClick={() => dispatch(toggleSideMenu())} />
        <div className="p-4 sm:p-6 flex-1">{inner}</div>
      </div>
    </div>
  );
};

export default MainLayout;
