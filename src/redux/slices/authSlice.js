
import { createSlice } from "@reduxjs/toolkit";
import {
  saveToken,
  getCurrentUser,
  removeToken,
} from "../../utils/authStorage";

const initialState = {
  token: null,
  userId: null,
  role: null,
  data: null, // admin object
  isLoggedIn: false,
  isAuthChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser(state, action) {
      console.log(action.payload, "payload ye hi hai")
      const { token, id,admin } = action.payload;

      if (!token || !id) {
        console.error("Invalid payload passed to loginUser:", action.payload);
        return;
      }

      const userId = id;
      const role = "admin";

      state.token = token;
      state.userId = userId;
      state.role = role;
      state.data = null;
      state.isLoggedIn = true;

      saveToken(userId, token, role,admin); // admin is optional
    },

    logoutUser(state) {
      if (state.userId) {
        removeToken(state.userId);
      }
      state.token = null;
      state.userId = null;
      state.role = null;
      state.data = null;
      state.isLoggedIn = false;
      state.isAuthChecked = true;
    },

    loadUserFromStorage(state) {
     
      const user = getCurrentUser();
      if (user && user.token && user.role) {
        state.token = user.token;
        state.userId = user.userId;
        state.role = user.role;
        state.data = user.admin ?? null; // default to null
        state.isLoggedIn = true;
      }
      state.isAuthChecked = true;
    },
  },
});

export const { loginUser, logoutUser, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
