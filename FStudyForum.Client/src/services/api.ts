import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
  withCredentials: true
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedQueue = [];
};
const refreshToken = async () => {
  try {
    await api.get<Response>("/auth/refresh-token");
    processQueue(null);
  } catch (error) {
    processQueue(error);
    throw error;
  }
};

const getNewToken = async () => {
  if (!isRefreshing) {
    isRefreshing = true;
    await refreshToken();
    isRefreshing = false;
    return;
  }
  return new Promise((resolve, reject) => {
    failedQueue.push({ resolve, reject });
  });
};

api.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const { response, config } = error;
    const status = response?.status;
    const shouldRenewToken = status === 401 && !config._retry;
    if (shouldRenewToken) {
      config._retry = true;
      try {
        await getNewToken();
        return axios(config);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
