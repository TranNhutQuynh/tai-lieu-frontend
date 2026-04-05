export const saveAuth = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getToken = () => localStorage.getItem("token");

export const getUser = () => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

export const updateStoredUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const isLoggedIn = () => !!getToken();

export const isAdmin = () => {
  const user = getUser();
  return user?.role === "admin";
};
