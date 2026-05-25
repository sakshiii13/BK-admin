// src/components/sidebar/SideBar.jsx

import React, { useEffect, useState } from "react";
import {
  MdDashboard,
  MdInventory2,
  MdCategory,
  MdStore,
  MdPeople,
  MdChevronLeft,
  MdKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdShoppingCart,
  MdPayments,
  MdLocalShipping,
  MdStarRate,
  MdBarChart,
  MdSupportAgent,
  MdNotifications,
  MdSettings,
} from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { Routers } from "../../constants/routes";
import { closeSideMenu } from "../../redux/slices/sideBarMenuSlice";

const logo = "/logo.png";

const SideBar = () => {
  const dispatch = useDispatch();
  const sideToggle = useSelector((state) => state?.sideMenu?.open);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isSmallScreen = () => window.innerWidth <= 1024;

  const defaultMenus = {
    productManagement: false,
    categoryManagement: false,
    storeManagement: false,
    userManagement: false,
    orderManagement: false,
    transactionManagement: false,
    driverManagement: false,
    ratingManagement: false,
    reportsManagement: false,
  };

  const [openMenus, setOpenMenus] = useState(defaultMenus);

  useEffect(() => {
    const handleResize = () => {
      if (isSmallScreen()) dispatch(closeSideMenu());
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({
      ...defaultMenus,
      [key]: !prev[key],
    }));
  };

  const handleNavigate = (route) => {
    if (!route) return;

    navigate(route);

    if (isSmallScreen()) {
      dispatch(closeSideMenu());
    }
  };

  const NavItem = ({ icon, label, router }) => {
    const isActive = pathname === router;

    return (
      <div
        onClick={() => handleNavigate(router)}
        className={`flex items-center gap-3 py-3 px-4 mx-3 rounded-xl cursor-pointer transition-all duration-300 group
        ${
          isActive
            ? "bg-gradient-to-r from-[rgba(243,112,35,0.15)] to-[rgba(57,181,74,0.05)] text-white border-l-4 border-[var(--primary-orange)] shadow-md"
            : "text-slate-400 hover:bg-white/[0.02] hover:text-white border-l-4 border-transparent hover:border-[var(--primary-green-light)]"
        }`}
      >
        <span className={`text-xl transition-all duration-300 ${isActive ? "text-[var(--primary-orange)]" : "text-slate-400 group-hover:text-[var(--primary-green-light)]"}`}>{icon}</span>
        <span className="text-sm font-medium tracking-wide">{label}</span>
      </div>
    );
  };

  const DropdownMenu = ({ icon, label, isOpen, onToggle, items }) => {
    const isChildActive = items.some((item) => pathname === item.route);

    return (
      <div className="mx-3">
        <div
          onClick={onToggle}
          className={`flex items-center justify-between py-3 px-4 rounded-xl cursor-pointer transition-all duration-300 group
          ${
            isChildActive
              ? "bg-gradient-to-r from-[rgba(243,112,35,0.08)] to-[rgba(57,181,74,0.03)] text-white border-l-4 border-[var(--primary-orange)]"
              : "text-slate-400 hover:bg-white/[0.02] hover:text-white border-l-4 border-transparent hover:border-[var(--primary-green-light)]"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className={`text-xl transition-all duration-300 ${isChildActive ? "text-[var(--primary-orange)]" : "text-slate-400 group-hover:text-[var(--primary-green-light)]"}`}>{icon}</span>
            <span className="text-sm font-medium tracking-wide">{label}</span>
          </div>

          <MdChevronLeft
            className={`transition-all duration-300 text-slate-400 group-hover:text-white ${
              isOpen ? "-rotate-90 text-[var(--primary-orange)]" : ""
            }`}
            size={18}
          />
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[500px] mt-1.5 space-y-1" : "max-h-0"
          }`}
        >
          {items.map((item, index) => {
            const isActive = pathname === item.route;

            return (
              <div
                key={index}
                onClick={() => handleNavigate(item.route)}
                className={`flex items-center gap-2 ml-6 py-2 px-3 rounded-lg cursor-pointer transition-all duration-300
                ${
                  isActive
                    ? "text-[var(--primary-green-light)] font-semibold bg-white/[0.03]"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.01]"
                }`}
              >
                <MdKeyboardArrowRight size={16} className={isActive ? "text-[var(--primary-green-light)] animate-pulse" : "text-slate-600"} />
                <span className="text-xs tracking-wide">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-[260px]
      bg-[rgba(6,10,7,0.95)] backdrop-blur-xl border-r border-[var(--border-soft)]
      transition-all duration-300 ease-in-out
      flex flex-col justify-between shadow-[10px_0_30px_rgba(0,0,0,0.5)]
      ${sideToggle ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      <div className="relative border-b border-[var(--border-soft)] px-6 py-5 flex items-center justify-center bg-black/10">
        <img
          src={logo}
          alt="logo"
          className="w-32 object-contain cursor-pointer transition-transform duration-300 hover:scale-105 hover:rotate-1"
          onClick={() => handleNavigate(Routers.DASHBOARD)}
        />

        <MdOutlineKeyboardDoubleArrowLeft
          size={24}
          className="absolute right-4 text-[var(--primary-orange-light)] cursor-pointer lg:hidden hover:text-white transition-colors"
          onClick={() => dispatch(closeSideMenu())}
        />
      </div>

      <div className="flex-1 overflow-y-auto py-6 space-y-1.5 sidebar-scroll">
        <NavItem
          icon={<MdDashboard />}
          label="Dashboard"
          router={Routers.DASHBOARD}
        />

        <DropdownMenu
          icon={<MdInventory2 />}
          label="Product Management"
          isOpen={openMenus.productManagement}
          onToggle={() => toggleMenu("productManagement")}
          items={[
            { label: "Products", route: Routers.PRODUCTS },
            { label: "All Products", route: Routers.ALL_PRODUCTS },
            { label: "Add Product", route: Routers.ADD_PRODUCT },
          ]}
        />

        <DropdownMenu
          icon={<MdCategory />}
          label="Category Management"
          isOpen={openMenus.categoryManagement}
          onToggle={() => toggleMenu("categoryManagement")}
          items={[
            { label: "Categories", route: Routers.CATEGORIES },
            { label: "Sub Categories", route: Routers.SUB_CATEGORIES },
            { label: "Brands", route: Routers.BRANDS },
          ]}
        />

        <DropdownMenu
          icon={<MdStore />}
          label="Store Management"
          isOpen={openMenus.storeManagement}
          onToggle={() => toggleMenu("storeManagement")}
          items={[
            { label: "Stores", route: Routers.STORES },
            { label: "Inventory", route: Routers.INVENTORY },
            { label: "Store Categories", route: Routers.STORE_CATEGORIES },
            {
              label: "Store Sub Categories",
              route: Routers.STORE_SUB_CATEGORIES,
            },
            { label: "Store Products", route: Routers.STORE_PRODUCTS },
            { label: "Product Details", route: Routers.PRODUCT_DETAILS },
          ]}
        />

        <DropdownMenu
          icon={<MdPeople />}
          label="User Management"
          isOpen={openMenus.userManagement}
          onToggle={() => toggleMenu("userManagement")}
          items={[
            { label: "Users", route: Routers.USERS },
            { label: "All Users", route: Routers.ALL_USERS },
            { label: "Add User", route: Routers.ADD_USER },
            { label: "Admin Roles", route: Routers.ADMIN_ROLES },
          ]}
        />

        <DropdownMenu
          icon={<MdShoppingCart />}
          label="Order Management"
          isOpen={openMenus.orderManagement}
          onToggle={() => toggleMenu("orderManagement")}
          items={[
            { label: "Orders", route: Routers.ORDERS },
            { label: "All Orders", route: Routers.ALL_ORDERS },
            { label: "Pending Orders", route: Routers.PENDING_ORDERS },
            { label: "Packed Orders", route: Routers.PACKED_ORDERS },
            { label: "Shipping", route: Routers.SHIPPING },
            { label: "Assign Driver", route: Routers.ASSIGN_DRIVER },
            { label: "Order Status", route: Routers.ORDER_STATUS },
          ]}
        />

        <DropdownMenu
          icon={<MdPayments />}
          label="Payments"
          isOpen={openMenus.transactionManagement}
          onToggle={() => toggleMenu("transactionManagement")}
          items={[
            { label: "Transactions", route: Routers.TRANSACTIONS },
            { label: "Wallets", route: Routers.WALLETS },
            { label: "User Transactions", route: Routers.USER_TRANSACTIONS },
          ]}
        />

        <DropdownMenu
          icon={<MdLocalShipping />}
          label="Driver Management"
          isOpen={openMenus.driverManagement}
          onToggle={() => toggleMenu("driverManagement")}
          items={[
            { label: "Drivers", route: Routers.DRIVERS },
            { label: "All Drivers", route: Routers.ALL_DRIVERS },
            { label: "Add Driver", route: Routers.ADD_DRIVER },
          ]}
        />

        <DropdownMenu
          icon={<MdStarRate />}
          label="Rating Management"
          isOpen={openMenus.ratingManagement}
          onToggle={() => toggleMenu("ratingManagement")}
          items={[
            { label: "Ratings", route: Routers.RATINGS },
            { label: "All Ratings", route: Routers.ALL_RATINGS },
            { label: "Average Rating", route: Routers.AVG_RATING },
          ]}
        />

        <DropdownMenu
          icon={<MdBarChart />}
          label="Reports"
          isOpen={openMenus.reportsManagement}
          onToggle={() => toggleMenu("reportsManagement")}
          items={[
            { label: "Sales Report", route: Routers.SALES_REPORT },
            { label: "User Analytics", route: Routers.USER_ANALYTICS },
          ]}
        />

        <div className="pt-4 border-t border-[var(--border-soft)] space-y-1.5">
          <NavItem
            icon={<MdSupportAgent />}
            label="Support"
            router={Routers.SUPPORT}
          />

          <NavItem
            icon={<MdNotifications />}
            label="Notifications"
            router={Routers.NOTIFICATIONS}
          />

          <NavItem
            icon={<MdSettings />}
            label="Settings"
            router={Routers.SETTINGS}
          />
        </div>
      </div>
    </div>
  );
};

export default SideBar;