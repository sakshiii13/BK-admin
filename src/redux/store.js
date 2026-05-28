import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import sideMenuReducer from './slices/sideBarMenuSlice';
import loaderReducer from './slices/loaderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    sideMenu: sideMenuReducer,
    loader: loaderReducer,
  },
});
