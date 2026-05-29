// src/layouts/MainLayout.jsx

import React from "react";
import { useDispatch } from "react-redux";

import SideBar from "../components/ui/SideBar";
import TopBar from "../components/ui/TopBar";

import { toggleSideMenu } from "../redux/slices/sideBarMenuSlice";

const MainLayout = ({ inner }) => {
  const dispatch = useDispatch();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      
      {/* SIDEBAR */}
      <SideBar />

      {/* MAIN CONTENT */}
      <div className="flex-1 min-h-screen flex flex-col">
        
        {/* TOPBAR */}
        <TopBar onMenuClick={() => dispatch(toggleSideMenu())} />

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6">
          {inner}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;