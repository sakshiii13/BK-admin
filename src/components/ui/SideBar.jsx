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
  MdOutlineSettings,
  MdSupportAgent,
  MdNotifications,
  MdMenu,
} from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";

import { useLocation, useNavigate } from "react-router-dom";

import { Routers } from "../../constants/routes";

import {
  closeSideMenu,
  openSideMenu,
} from "../../redux/slices/sideBarMenuSlice";

const logo = "/logo.png";

const SideBar = () => {
  // =========================================
  // REDUX
  // =========================================
  const dispatch = useDispatch();

  const sideToggle = useSelector(
    (state) => state?.sideMenu?.open
  );

  // =========================================
  // REACT ROUTER
  // =========================================
  const navigate = useNavigate();

  const { pathname } = useLocation();

  // =========================================
  // MOBILE CHECK
  // =========================================
  const isSmallScreen = () =>
    window.innerWidth <= 1024;

  // =========================================
  // COLLAPSE STATE
  // false = full sidebar
  // true = icon only sidebar
  // =========================================
  const [collapsed, setCollapsed] =
    useState(false);

  // =========================================
  // DROPDOWN STATE
  // =========================================
  const defaultMenus = {
    productManagement: false,
    categoryManagement: false,
    storeManagement: false,
    userManagement: false,
    orderManagement: false,
    transactionManagement: false,
    driverManagement: false,
  };

  const [openMenus, setOpenMenus] =
    useState(defaultMenus);

  // =========================================
  // WINDOW RESIZE
  // =========================================
  useEffect(() => {
    const handleResize = () => {
      if (isSmallScreen()) {
        dispatch(closeSideMenu());
      } else {
        dispatch(openSideMenu());
      }
    };

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, [dispatch]);

  // =========================================
  // TOGGLE DROPDOWN
  // =========================================
  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({
      ...defaultMenus,
      [key]: !prev[key],
    }));
  };

  // =========================================
  // NAVIGATION
  // =========================================
  const handleNavigate = (route) => {
    if (!route) return;

    navigate(route);

    if (isSmallScreen()) {
      dispatch(closeSideMenu());
    }
  };

  // =========================================
  // SIDEBAR OPEN/CLOSE
  // =========================================
  const handleSidebarToggle = () => {
    if (sideToggle) {
      dispatch(closeSideMenu());
    } else {
      dispatch(openSideMenu());
    }
  };

  // =========================================
  // COLLAPSE BUTTON
  // =========================================
  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  // =========================================
  // NAV ITEM
  // =========================================
  const NavItem = ({
    icon,
    label,
    router,
  }) => {
    const isActive = pathname === router;

    return (
      <div
        onClick={() => handleNavigate(router)}
        className={`group flex items-center ${
          collapsed
            ? "justify-center"
            : "gap-3.5"
        } py-3 px-4 mx-3 rounded-xl cursor-pointer transition-all duration-200 border
        
        ${
          isActive
            ? "bg-gradient-to-r from-orange-50 to-orange-100/40 text-orange-600 border-orange-200/80"
            : "text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-50"
        }`}
      >
        {/* ICON */}
        <span
          className={`text-[22px]
          ${
            isActive
              ? "text-orange-500"
              : "text-slate-400"
          }`}
        >
          {icon}
        </span>

        {/* LABEL */}
        {!collapsed && (
          <span className="text-[14px] font-bold tracking-wide">
            {label}
          </span>
        )}
      </div>
    );
  };

  // =========================================
  // DROPDOWN MENU
  // =========================================
  const DropdownMenu = ({
    icon,
    label,
    isOpen,
    onToggle,
    items,
  }) => {
    const isChildActive = items.some(
      (item) => pathname === item.route
    );

    return (
      <div className="mx-3">
        {/* PARENT */}
        <div
          onClick={onToggle}
          className={`group flex items-center ${
            collapsed
              ? "justify-center"
              : "justify-between"
          } py-3 px-4 rounded-xl cursor-pointer transition-all duration-200 border
          
          ${
            isChildActive
              ? "bg-slate-50 text-slate-800 border-slate-200"
              : "text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-50"
          }`}
        >
          <div
            className={`flex items-center ${
              collapsed
                ? ""
                : "gap-3.5"
            }`}
          >
            <span
              className={`text-[22px]
              ${
                isChildActive
                  ? "text-orange-500"
                  : "text-slate-400"
              }`}
            >
              {icon}
            </span>

            {!collapsed && (
              <span className="text-[14px] font-bold tracking-wide">
                {label}
              </span>
            )}
          </div>

          {/* ARROW */}
          {!collapsed && (
            <MdChevronLeft
              className={`transition-transform duration-300
                
              ${
                isOpen
                  ? "-rotate-90 text-orange-500"
                  : "text-slate-400"
              }`}
              size={20}
            />
          )}
        </div>

        {/* SUB MENU */}
        {!collapsed && (
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out pl-6 ml-5 border-l-2 border-slate-100
            
            ${
              isOpen
                ? "max-h-[500px] mt-1.5 space-y-1 py-1"
                : "max-h-0"
            }`}
          >
            {items.map((item, index) => {
              const isSubItemActive =
                pathname === item.route;

              return (
                <div
                  key={index}
                  onClick={() =>
                    handleNavigate(
                      item.route
                    )
                  }
                  className={`flex items-center gap-2 py-2.5 px-3.5 rounded-xl cursor-pointer transition-all duration-150
                    
                    ${
                      isSubItemActive
                        ? "text-green-600 font-bold bg-green-50"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                >
                  <MdKeyboardArrowRight
                    size={16}
                  />

                  <span className="text-[13px] font-bold">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* =========================================
          MOBILE TOPBAR
      ========================================= */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[60] h-[70px] bg-white border-b border-slate-200 flex items-center justify-between px-4 shadow-sm">
        <button
          onClick={handleSidebarToggle}
          className="h-11 w-11 rounded-xl border border-slate-200 flex items-center justify-center bg-slate-50"
        >
          <MdMenu size={24} />
        </button>

        <img
          src={logo}
          alt="logo"
          className="w-[200px] object-contain"
        />
      </div>

      {/* =========================================
          BACKDROP
      ========================================= */}
      {sideToggle && (
        <div
          onClick={() =>
            dispatch(closeSideMenu())
          }
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* =========================================
          SIDEBAR
      ========================================= */}
      <div
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-white border-r border-slate-200 shadow-sm
        
        transition-all duration-300 ease-in-out flex flex-col
        
        ${
          collapsed
            ? "w-[90px]"
            : "w-[280px]"
        }
        
        ${
          sideToggle
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* =========================================
            HEADER
        ========================================= */}
        <div
          className={`px-4 h-[76px] border-b border-slate-100 bg-slate-50/30 flex items-center
        
          ${
            collapsed
              ? "justify-center"
              : "justify-between"
          }`}
        >
          {/* LOGO */}
          {!collapsed && (
            <img
              src={logo}
              alt="logo"
              className="w-[200px] object-contain cursor-pointer"
              onClick={() =>
                handleNavigate(
                  Routers.DASHBOARD
                )
              }
            />
          )}

          {/* SMALL LOGO */}
          {collapsed && (
            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xl">
              BK
            </div>
          )}

          {/* COLLAPSE BUTTON */}
          {!isSmallScreen() && (
            <button
              onClick={handleCollapse}
              className={`h-10 w-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-orange-500
                
                ${
                  collapsed
                    ? "absolute top-5 -right-5 shadow-md"
                    : ""
                }`}
            >
              <MdOutlineKeyboardDoubleArrowLeft
                size={22}
                className={`transition-transform duration-300
                    
                ${
                  collapsed
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>
          )}
        </div>

        {/* =========================================
            MENU AREA
        ========================================= */}
        <div className="flex-1 overflow-y-auto py-6 space-y-1.5">
          <NavItem
            icon={<MdDashboard />}
            label="Dashboard"
            router={Routers.DASHBOARD}
          />

          <DropdownMenu
            icon={<MdInventory2 />}
            label="Product Management"
            isOpen={
              openMenus.productManagement
            }
            onToggle={() =>
              toggleMenu(
                "productManagement"
              )
            }
            items={[
              {
                label: "Products",
                route: Routers.PRODUCTS,
              },
              {
                label: "All Products",
                route:
                  Routers.ALL_PRODUCTS,
              },
              {
                label: "Add Product",
                route:
                  Routers.ADD_PRODUCT,
              },
            ]}
          />

          <DropdownMenu
            icon={<MdCategory />}
            label="Category Management"
            isOpen={
              openMenus.categoryManagement
            }
            onToggle={() =>
              toggleMenu(
                "categoryManagement"
              )
            }
            items={[
              {
                label: "Categories",
                route:
                  Routers.CATEGORIES,
              },
              {
                label: "Sub Categories",
                route:
                  Routers.SUB_CATEGORIES,
              },
              {
                label: "Brands",
                route: Routers.BRANDS,
              },
            ]}
          />

          <DropdownMenu
            icon={<MdStore />}
            label="Store Management"
            isOpen={
              openMenus.storeManagement
            }
            onToggle={() =>
              toggleMenu(
                "storeManagement"
              )
            }
            items={[
              {
                label: "Stores",
                route: Routers.STORES,
              },
              {
                label: "Inventory",
                route:
                  Routers.INVENTORY,
              },
              {
                label:
                  "Store Categories",
                route:
                  Routers.STORE_CATEGORIES,
              },
              {
                label:
                  "Store Sub Categories",
                route:
                  Routers.STORE_SUB_CATEGORIES,
              },
              {
                label:
                  "Store Products",
                route:
                  Routers.STORE_PRODUCTS,
              },
            ]}
          />

          <DropdownMenu
            icon={<MdPeople />}
            label="User Management"
            isOpen={
              openMenus.userManagement
            }
            onToggle={() =>
              toggleMenu(
                "userManagement"
              )
            }
            items={[
              {
                label: "Users",
                route: Routers.USERS,
              },
              {
                label: "All Users",
                route:
                  Routers.ALL_USERS,
              },
              {
                label: "Add User",
                route:
                  Routers.ADD_USER,
              },
              {
                label: "Admin Roles",
                route:
                  Routers.ADMIN_ROLES,
              },
            ]}
          />

          <DropdownMenu
            icon={<MdShoppingCart />}
            label="Order Management"
            isOpen={
              openMenus.orderManagement
            }
            onToggle={() =>
              toggleMenu(
                "orderManagement"
              )
            }
            items={[
              {
                label: "Orders",
                route: Routers.ORDERS,
              },
              {
                label: "Pending",
                route:
                  Routers.PENDING_ORDERS,
              },
              {
                label: "Shipping",
                route:
                  Routers.SHIPPING,
              },
            ]}
          />

          <DropdownMenu
            icon={<MdPayments />}
            label="Payments"
            isOpen={
              openMenus.transactionManagement
            }
            onToggle={() =>
              toggleMenu(
                "transactionManagement"
              )
            }
            items={[
              {
                label: "Transactions",
                route:
                  Routers.TRANSACTIONS,
              },
              {
                label: "Wallets",
                route: Routers.WALLETS,
              },
            ]}
          />

          <DropdownMenu
            icon={<MdLocalShipping />}
            label="Driver Management"
            isOpen={
              openMenus.driverManagement
            }
            onToggle={() =>
              toggleMenu(
                "driverManagement"
              )
            }
            items={[
              {
                label: "Drivers",
                route: Routers.DRIVERS,
              },
              {
                label: "Add Driver",
                route:
                  Routers.ADD_DRIVER,
              },
            ]}
          />

          {/* EXTRA */}
          <div className="pt-5 mt-5 border-t border-slate-100 space-y-1.5">
            <NavItem
              icon={<MdSupportAgent />}
              label="Support"
              router={Routers.SUPPORT}
            />

            <NavItem
              icon={<MdNotifications />}
              label="Notifications"
              router={
                Routers.NOTIFICATIONS
              }
            />

            <NavItem
              icon={
                <MdOutlineSettings />
              }
              label="Settings"
              router={Routers.SETTINGS}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;