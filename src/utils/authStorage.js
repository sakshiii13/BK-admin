// utils/authStorage.js

const safeGetStorageItem = (key, defaultValue = null) => {
  try {
    const value = sessionStorage.getItem(key) || localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (e) {
    console.error(`Error accessing ${key}:`, e);
    return defaultValue;
  }
};

export const saveCurrentUser = (userId) => {
  if (!userId) {
    console.error("saveCurrentUser failed: Missing userId");
    return;
  }
  try {
    sessionStorage.setItem("currentUser", JSON.stringify(userId));
  } catch (e) {
    console.error("Error saving current user:", e);
  }
};

// ✅ save token + role + admin object
export const saveToken = (userId, token, role, admin) => {
  if (!userId || !token || !role) {
    console.error("❌ Refused to save token: Missing userId/token/role", {
      userId,
      token,
      role,
    });
    return;
  }

  const currentTokens = safeGetStorageItem("authTokens", {});
  currentTokens[userId] = { token, role, admin };

  try {
    localStorage.setItem("authTokens", JSON.stringify(currentTokens));
    saveCurrentUser(userId); // only save if userId is valid
  } catch (e) {
    console.error("Error saving token:", e);
  }
};


export const getToken = (userId) => {
  const currentTokens = safeGetStorageItem("authTokens", {});
  return currentTokens ? currentTokens[userId] : null;
};

// ✅ return full user object for currently active user
export const getCurrentUser = () => {
  const currentUser = safeGetStorageItem("currentUser");
  if (!currentUser) return null;

  const userData = getToken(currentUser);
  if (!userData) return null;

  return {
    userId: currentUser,
    token: userData.token,
    role: userData.role,
    admin: userData.admin,
  };
};

export const removeToken = (userId) => {
  const currentTokens = safeGetStorageItem("authTokens", {});
  sessionStorage.removeItem("currentUser");

  if (currentTokens && currentTokens[userId]) {
    delete currentTokens[userId];
    try {
      localStorage.setItem("authTokens", JSON.stringify(currentTokens));
    } catch (e) {
      console.error("Error removing token:", e);
    }
  }
};
