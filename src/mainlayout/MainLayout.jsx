// src/layouts/MainLayout.jsx

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../components/ui/SideBar";
import TopBar from "../components/ui/TopBar";
import { toggleSideMenu } from "../redux/slices/sideBarMenuSlice";

const MainLayout = ({ inner }) => {
  const dispatch = useDispatch();
  const sideToggle = useSelector((state) => state?.sideMenu?.open);

  return (
    // Background color ko dark variable se hata kar light gray (slate-50) kar diya hai
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <SideBar />
      <div 
        className={`w-full min-h-screen flex flex-col transition-all duration-300 ease-in-out
          ${sideToggle ? "lg:w-[calc(100%-260px)]" : "lg:w-full"}`}
      >
        <TopBar onMenuClick={() => dispatch(toggleSideMenu())} />
        
        {/* Content area ka padding maintain rakha hai */}
        <main className="p-4 sm:p-6 flex-1">
          {inner}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;