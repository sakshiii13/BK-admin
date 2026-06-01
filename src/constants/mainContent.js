// src/constants/mainContent.js

export const MainContent = {
  appName: "BK Grocery Admin",
  shortName: "BK Admin",
  logo: "/logo.png",
  companyName: "BK Grocery",
  version: "1.0.0",
  supportEmail: "support@bkgrocery.com",
};

export const backendConfig = {
  base:
    import.meta.env.VITE_API_BASE_URL ||
    "https://api.bkgrocery.starchainlabs.online/api",
  origin:
    import.meta.env.VITE_API_ORIGIN ||
    "https://api.bkgrocery.starchainlabs.online/",
};