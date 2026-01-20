const normalizePath = (path: string) => {
  if (!path) return "";
  return path.startsWith("/") ? path : `/${path}`;
};

export const APP_BASE_URL = "https://app.storyspark.com.br";
export const ADMIN_BASE_URL = "https://admin.storyspark.com.br";
export const LANDING_BASE_URL = "https://storyspark.com.br";

export const appUrl = (path = "") => `${APP_BASE_URL}${normalizePath(path)}`;
export const adminUrl = (path = "") => `${ADMIN_BASE_URL}${normalizePath(path)}`;
export const landingUrl = (path = "") => `${LANDING_BASE_URL}${normalizePath(path)}`;
