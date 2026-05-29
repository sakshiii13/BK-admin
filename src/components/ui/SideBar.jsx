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
  MdMenu,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Routers } from "../../constants/routes";
import { closeSideMenu } from "../../redux/slices/sideBarMenuSlice";

const logo = "/logo.png";

const SideBar = () => {
  // =========================================
  // REDUX
  // =========================================
  const dispatch = useDispatch();
  const sideToggle = useSelector((state) => state?.sideMenu?.open);

  // =========================================
  // REACT ROUTER
  // =========================================
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // =========================================
  // STATES
  // =========================================
  const [collapsed, setCollapsed] = useState(false);

  // =========================================
  // RESPONSIVE CHECK
  // =========================================
  const isSmallScreen = () => window.innerWidth <= 1024;

  // =========================================
  // DEFAULT MENUS
  // =========================================
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

  // =========================================
  // AUTO OPEN ACTIVE MENU (ONLY ON INITIAL LOAD)
  // =========================================
  useEffect(() => {
    setOpenMenus({
      productManagement: pathname.startsWith("/products"),
      categoryManagement:
        pathname.startsWith("/categories") ||
        pathname.startsWith("/sub-categories") ||
        pathname.startsWith("/brands"),
      storeManagement:
        pathname.startsWith("/stores") ||
        pathname.startsWith("/store/orders") ||
        pathname.startsWith("/store/out-for-delivery") ||
        pathname.startsWith("/store-products") ||
        pathname.startsWith("/store-categories") ||
        pathname.startsWith("/store-sub-categories") ||
        pathname.startsWith("/inventory"),
      userManagement: pathname.startsWith("/users"),
      orderManagement: pathname.startsWith("/orders"),
      transactionManagement: pathname.startsWith("/payments"),
      driverManagement: pathname.startsWith("/drivers"),
      ratingManagement: pathname.startsWith("/ratings"),
      reportsManagement: pathname.startsWith("/reports"),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================================
  // CLOSE SIDEBAR ON SMALL SCREEN
  // =========================================
  useEffect(() => {
    const handleResize = () => {
      if (isSmallScreen()) {
        dispatch(closeSideMenu());
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  // =========================================
  // TOGGLE MENU
  // =========================================
  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // =========================================
  // NAVIGATE
  // =========================================
  const handleNavigate = (route) => {
    if (!route) return;
    navigate(route);
    if (isSmallScreen()) {
      dispatch(closeSideMenu());
    }
  };

  // =========================================
  // NAV ITEM (3D EFFECT)
  // =========================================
  const NavItem = ({ icon, label, router }) => {
    const isActive = pathname === router || pathname.startsWith(`${router}/`);

    return (
      <div
        onClick={() => handleNavigate(router)}
        className={`
          relative group flex items-center select-none
          ${collapsed ? "justify-center px-2 py-3 mx-3" : "gap-3 px-4 py-3 mx-4"}
          rounded-2xl cursor-pointer transition-all duration-300 ease-out
          ${
            isActive
              ? "bg-gradient-to-br from-white to-slate-50 border border-white/60 shadow-[0_10px_20px_-5px_rgba(249,115,22,0.15),0_4px_6px_-2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.8)] -translate-y-[2px]"
              : "border border-transparent hover:bg-white/40 hover:border-white/20 hover:shadow-[0_8px_16px_-6px_rgba(0,0,0,0.05)] hover:-translate-y-[1px]"
          }
          active:translate-y-0 active:shadow-sm
        `}
      >
        {isActive && (
          <div className="absolute left-0 top-[20%] h-[60%] w-[5px] rounded-r-full bg-gradient-to-b from-orange-400 to-orange-600 shadow-[1px_0_8px_rgba(249,115,22,0.6)]" />
        )}

        <span
          className={`
            relative z-10 text-[22px] p-1 rounded-xl transition-all duration-300
            ${
              isActive
                ? "text-orange-500 drop-shadow-[0_3px_6px_rgba(249,115,22,0.3)] scale-110"
                : "text-slate-400 group-hover:text-orange-500 group-hover:scale-110"
            }
          `}
        >
          {icon}
        </span>

        {!collapsed && (
          <span
            className={`
              relative z-10 text-[14px] font-bold tracking-wide transition-all duration-300
              ${isActive ? "text-slate-800" : "text-slate-500 group-hover:text-slate-800"}
            `}
          >
            {label}
          </span>
        )}
      </div>
    );
  };

  // =========================================
  // DROPDOWN MENU (3D EFFECT)
  // =========================================
  const DropdownMenu = ({ icon, label, isOpen, onToggle, items }) => {
    const isChildActive = items.some((item) => {
      if (!item.route) return false;
      return pathname === item.route || pathname.startsWith(`${item.route}/`);
    });

    return (
      <div className={`transition-all duration-300 ${collapsed ? "mx-3" : "mx-4"}`}>
        <div
          onClick={onToggle}
          className={`
            relative group flex items-center justify-between select-none
            ${collapsed ? "px-2 py-3 justify-center" : "px-4 py-3"}
            rounded-2xl cursor-pointer transition-all duration-300 ease-out
            ${
              isChildActive
                ? "bg-gradient-to-br from-white to-slate-50 border border-white/80 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.9)]"
                : "border border-transparent hover:bg-white/40 hover:border-white/20 hover:shadow-[0_8px_16px_-6px_rgba(0,0,0,0.05)] hover:-translate-y-[1px]"
            }
            active:translate-y-0
          `}
        >
          {isChildActive && (
            <div className="absolute left-0 top-[20%] h-[60%] w-[4px] rounded-r-full bg-orange-400 shadow-[1px_0_6px_rgba(249,115,22,0.4)]" />
          )}

          <div className={`relative z-10 flex items-center ${collapsed ? "" : "gap-3"}`}>
            <span
              className={`
                text-[22px] transition-all duration-300
                ${
                  isChildActive
                    ? "text-orange-500 drop-shadow-[0_2px_4px_rgba(249,115,22,0.2)] scale-110"
                    : "text-slate-400 group-hover:text-orange-500 group-hover:scale-110"
                }
              `}
            >
              {icon}
            </span>

            {!collapsed && (
              <span
                className={`
                  text-[14px] font-bold tracking-wide transition-all duration-300
                  ${isChildActive ? "text-slate-800" : "text-slate-500 group-hover:text-slate-800"}
                `}
              >
                {label}
              </span>
            )}
          </div>

          {!collapsed && (
            <MdChevronLeft
              className={`
                relative z-10 transition-all duration-300 ease-out
                ${isOpen ? "-rotate-90 text-orange-500 scale-110" : "text-slate-400 group-hover:text-slate-700"}
              `}
              size={18}
            />
          )}
        </div>

        {!collapsed && (
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out pl-4 rounded-b-2xl ${
              isOpen
                ? "max-h-[500px] mt-1 mb-2 py-1 bg-slate-900/5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200/40"
                : "max-h-0"
            }`}
          >
            {items.map((item, index) => {
              const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);

              return (
                <div
                  key={index}
                  onClick={() => handleNavigate(item.route)}
                  className={`
                    mr-2 flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer 
                    transition-all duration-200 group/sub select-none
                    ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-[0_4px_12px_rgba(249,115,22,0.25)] scale-[1.02]"
                        : "hover:bg-white text-slate-500 hover:text-slate-800 font-medium hover:shadow-sm"
                    }
                  `}
                >
                  <MdKeyboardArrowRight
                    size={16}
                    className={`
                      transition-all duration-200
                      ${isActive ? "text-white rotate-90" : "text-slate-400 group-hover/sub:text-orange-500 group-hover/sub:translate-x-1"}
                    `}
                  />
                  <span className="text-[13px] tracking-wide">{item.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen select-none
        ${collapsed ? "w-[100px]" : "w-[300px]"}
        bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200/90
        backdrop-blur-xl border-r border-white/60
        transition-all duration-300 ease-in-out
        flex flex-col justify-between
        shadow-[5px_0_30px_rgba(15,23,42,0.04),inset_-1px_0_0_rgba(255,255,255,0.6)]
        ${sideToggle ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      {/* ========================================= */}
      {/* BRANDING HEADER ZONE (OPTIMIZED LOGO) */}
      {/* ========================================= */}
      <div
        className={`
          relative flex items-center h-[85px] w-full transition-all duration-300
          ${collapsed ? "justify-center px-2" : "justify-between px-5"}
          bg-white/80 backdrop-blur-md border-b border-gradient-to-r from-slate-200/60 via-slate-100 to-transparent
        `}
      >
        {/* LOGO BACKDROP SOFT 3D SHADOW GLOW */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-28 bg-orange-500/10 rounded-full blur-xl pointer-events-none" />

        {/* LOGO CONTAINER W/ SYSTEMIZED PADDING */}
        <div className={`relative z-10 flex items-center justify-center ${collapsed ? "w-full h-12" : "h-14"}`}>
          <img
            src={logo}
            alt="logo"
            onClick={() => handleNavigate(Routers.DASHBOARD)}
            className={`
              max-h-full object-contain cursor-pointer transition-all duration-500 ease-out
              filter drop-shadow-[0_4px_10px_rgba(15,23,42,0.08)] hover:scale-105 active:scale-95
              ${collapsed ? "w-[114px] p-0.5" : "w-[135px] py-1"}
            `}
          />
        </div>

        {/* COLLAPSE/EXPAND TRIGGER TOGGLE (3D FLOATING) */}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="
              relative z-10 h-10 w-10 flex items-center justify-center
              rounded-xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50
              text-slate-500 shadow-[0_4px_10px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.9)]
              transition-all duration-300 hover:from-orange-500 hover:to-orange-600 hover:text-white
              hover:border-orange-600 hover:shadow-[0_6px_15px_rgba(249,115,22,0.3)]
              active:scale-95 active:translate-y-0
            "
          >
            <MdOutlineKeyboardDoubleArrowLeft size={20} />
          </button>
        )}

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="
              absolute -right-4 top-1/2 -translate-y-1/2 z-20
              h-9 w-9 rounded-xl bg-gradient-to-b from-orange-500 to-orange-600 text-white
              flex items-center justify-center shadow-[0_6px_15px_rgba(249,115,22,0.35)]
              transition-all duration-300 hover:scale-110 active:scale-95
            "
          >
            <MdMenu size={18} />
          </button>
        )}
      </div>

      {/* INNER MENU CONTAINER */}
      <div className="flex-1 overflow-y-auto py-6 space-y-2.5 sidebar-scroll">
        {/* DASHBOARD */}
        <NavItem icon={<MdDashboard />} label="Dashboard" router={Routers.DASHBOARD} />

        {/* PRODUCT MANAGEMENT */}
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

        {/* CATEGORY MANAGEMENT */}
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

        {/* STORE MANAGEMENT */}
        <DropdownMenu
          icon={<MdStore />}
          label="Store Management"
          isOpen={openMenus.storeManagement}
          onToggle={() => toggleMenu("storeManagement")}
          items={[
            { label: "Stores", route: Routers.STORES },
            { label: "Inventory", route: Routers.INVENTORY },
            { label: "Store Categories", route: Routers.STORE_CATEGORIES },
            { label: "Store Sub Categories", route: Routers.STORE_SUB_CATEGORIES },
            { label: "Store Products", route: Routers.STORE_PRODUCTS },
            { label: "Store Orders", route: Routers.STORE_ORDERS },
            { label: "Out For Delivery", route: Routers.OUT_FOR_DELIVERY },
          ]}
        />

        {/* USER MANAGEMENT */}
        <DropdownMenu
          icon={<MdPeople />}
          label="User Management"
          isOpen={openMenus.userManagement}
          onToggle={() => toggleMenu("userManagement")}
          items={[
            { label: "Users", route: Routers.USERS },
            { label: "All Users", route: Routers.ALL_USERS },
          ]}
        />

        {/* ORDER MANAGEMENT */}
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
          ]}
        />

        {/* PAYMENTS */}
        <DropdownMenu
          icon={<MdPayments />}
          label="Payments"
          isOpen={openMenus.transactionManagement}
          onToggle={() => toggleMenu("transactionManagement")}
          items={[
            { label: "Transactions", route: Routers.TRANSACTIONS },
            { label: "Wallets", route: Routers.WALLETS },
          ]}
        />

        {/* DRIVER */}
        <DropdownMenu
          icon={<MdLocalShipping />}
          label="Driver Management"
          isOpen={openMenus.driverManagement}
          onToggle={() => toggleMenu("driverManagement")}
          items={[
            { label: "Drivers", route: Routers.DRIVERS },
            { label: "Add Driver", route: Routers.ADD_DRIVER },
          ]}
        />

        {/* RATINGS */}
        <DropdownMenu
          icon={<MdStarRate />}
          label="Rating Management"
          isOpen={openMenus.ratingManagement}
          onToggle={() => toggleMenu("ratingManagement")}
          items={[
            { label: "Ratings", route: Routers.RATINGS },
            { label: "All Ratings", route: Routers.ALL_RATINGS },
          ]}
        />

        {/* REPORTS */}
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

        {/* BOTTOM FIXED ZONE */}
        <div className="pt-5 mt-5 border-t border-slate-200/60 space-y-2.5">
          <NavItem icon={<MdSupportAgent />} label="Support" router={Routers.SUPPORT} />
          <NavItem icon={<MdNotifications />} label="Notifications" router={Routers.NOTIFICATIONS} />
          <NavItem icon={<MdSettings />} label="Settings" router={Routers.SETTINGS} />
        </div>
      </div>
    </div>
  );
};

export default SideBar;