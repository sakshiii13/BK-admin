import React from "react";
import { useDispatch, useSelector } from "react-redux";

import SideBar from "../components/ui/SideBar";
import TopBar from "../components/ui/TopBar";

import { toggleSideMenu, closeSideMenu } from "../redux/slices/sideBarMenuSlice";

const MainLayout = ({ inner }) => {
  const dispatch = useDispatch();
  const sideToggle = useSelector((state) => state?.sideMenu?.open);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 relative">
      
      {/* MOBILE BACKDROP OVERLAY */}
      {sideToggle && (
        <div
          onClick={() => dispatch(closeSideMenu())}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-all duration-300 cursor-pointer"
        />
      )}

      {/* SIDEBAR */}
      <SideBar />

      {/* MAIN CONTENT */}
      <div className="flex-1 min-h-screen flex flex-col overflow-x-hidden">
        
        {/* TOPBAR */}
        <TopBar onMenuClick={() => dispatch(toggleSideMenu())} />

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          {inner}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;