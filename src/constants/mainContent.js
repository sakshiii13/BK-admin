import logo from "/public/logo.png";

export const MainContent = {
  appName: "BK Grocery Admin",
  shortName: "BK Admin",
  logo: logo,
  companyName: "BK Grocery",
  version: "1.0.0",
  supportEmail: "support@bkgrocery.com",
};

// export const backendConfig = {
//   base:
//     import.meta.env.VITE_API_BASE_URL ||
//     "https://api.bkgrocery.starchainlabs.online/api",
//   origin:
//     import.meta.env.VITE_API_ORIGIN ||
//     "https://api.bkgrocery.starchainlabs.online/",

    export const backendConfig = {
  base:
    import.meta.env.VITE_API_BASE_URL ||
    "https://2cmwbm73-5000.inc1.devtunnels.ms/api",
  origin:
    import.meta.env.VITE_API_ORIGIN ||
    "https://2cmwbm73-5000.inc1.devtunnels.ms/",
};