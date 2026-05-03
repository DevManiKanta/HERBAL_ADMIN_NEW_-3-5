import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

function errorMessage(error) {
  const d = error?.response?.data;
  if (typeof d?.message === "string") return d.message;
  if (d?.errors && typeof d.errors === "object") {
    const first = Object.values(d.errors)[0];
    if (Array.isArray(first) && first[0]) return String(first[0]);
  }
  return null;
}

api.interceptors.request.use(
  (config) => {
    const path = window.location.pathname;

    let token = null;

    if (path.startsWith("/super-admin")) {
      token = localStorage.getItem("super_admin_token");
    } else {
      token = localStorage.getItem("token");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const path = window.location.pathname;
    const msg = errorMessage(error);

    if (path.startsWith("/super-admin")) {
      const token = localStorage.getItem("super_admin_token");

      if (status === 401 && token) {
        toast.error("Super Admin session expired. Please sign in again.");
        localStorage.removeItem("super_admin_token");
        localStorage.removeItem("super_admin_user");
        window.location.href = "/super-admin/login";
      }
    } else {
      const token = localStorage.getItem("token");

      if (status === 401 && token) {
        toast.error("Session expired. Please sign in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    if (status === 422) {
      toast.error(msg || "Please check your input and try again.", {
        id: "http-422",
      });
    } else if (status === 403) {
      toast.error(msg || "You do not have access to this action.");
    } else if (status >= 500) {
      toast.error(msg || "Server error. Please try again in a moment.");
    } else if (!error.response) {
      toast.error("Network error. Check your connection and try again.");
    }

    return Promise.reject(error);
  },
);

export default api;
