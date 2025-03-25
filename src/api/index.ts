import axios, { AxiosError, AxiosRequestConfig, Method } from "axios";
import _ from "lodash";


// Map to store cancel tokens
const cancelTokens = new Map();

const apiConfig = {
  baseURL:
    import.meta.env.PROD ?
      import.meta.env.VITE_APP_API_URL : import.meta.env.VITE_APP_API_DEV_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "ngrok-skip-browser-warning": null,
  },
};

// Create an axios instance with the specified base URL and headers
const mainAxios = axios.create(apiConfig);
// Function to generate a unique request key
const generateRequestKey = (config: AxiosRequestConfig) => {
  return `${config.method}-${config.url}-${JSON.stringify(
    config.params || {}
  )}-${JSON.stringify(config.data || {})}`;
};

// Request interceptor
mainAxios.interceptors.request.use(
  (config) => {
    const requestKey = generateRequestKey(config);
    // Cancel any existing request with the same signature
    // if (cancelTokens.has(requestKey)) {
    //   const { cancel } = cancelTokens.get(requestKey);
    //   cancel('Request canceled due to duplicate request');
    //   cancelTokens.delete(requestKey);
    // }

    // Create a new cancel token
    const cancelToken = axios.CancelToken.source();
    config.cancelToken = cancelToken.token;
    cancelTokens.set(requestKey, {
      cancel: cancelToken.cancel,
      timestamp: Date.now(),
    });

    return config;
  },
  (error) => {
    return Promise.reject(error instanceof Error ? error : new Error(error));
  }
);

// Response interceptor
mainAxios.interceptors.response.use(
  (response) => {
    // Clean up the cancel token after successful response
    const requestKey = generateRequestKey(response.config);
    cancelTokens.delete(requestKey);
    return response;
  },
  async (error: AxiosError<any>) => {
    // Don't handle cancellation errors as actual errors
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const { response, config } = error;

    // Clean up the cancel token
    if (config) {
      const requestKey = generateRequestKey(config);
      cancelTokens.delete(requestKey);
    }

    if (config?.url === "/Auth/SignIn") {
      return Promise.reject(error instanceof Error ? error : new Error(error));
    }
    // manage status api
    if (response) {
      const originalRequest = config as any;
      if (response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        await refreshAccessToken();
        return mainAxios(originalRequest);
      }
    } else {
      await refreshAccessToken();
    }

    // if (
    //   error.response?.status === 401 &&
    //   originalRequest?.url !== "/api/verify_otp"
    // ) {
    //   store.dispatch(authLogout());
    //   localStorage.clear();
    //   sessionStorage.clear();
    //   window.location.href = "/login";
    // }

    // if (error.response?.status === 503) {
    //   store.dispatch(maintenance(error.response.data?.message));
    // }

    return Promise.reject(error instanceof Error ? error : new Error(error));
  }
);

export const cancelAllRequests = () => {
  cancelTokens.forEach(({ cancel }) => {
    cancel("Operation canceled by user");
  });
  cancelTokens.clear();
};

// Function to cancel specific request
export const cancelRequest = (method?: Method, url?: string, params = {}, data = {}) => {
  const requestKey = generateRequestKey({ method, url, params, data });
  if (cancelTokens.has(requestKey)) {
    const { cancel } = cancelTokens.get(requestKey);
    cancel("Operation canceled by user");
    cancelTokens.delete(requestKey);
  }
};

// Clean up old tokens periodically (optional)
setInterval(() => {
  const now = Date.now();
  cancelTokens.forEach((value, key) => {
    if (now - value.timestamp > 30000) {
      // Remove tokens older than 30 seconds
      cancelTokens.delete(key);
    }
  });
}, 30000);

export default mainAxios;

export const errorResponse = (error: AxiosError) => {
  if (axios.isCancel(error)) {
    return { status: 499, statusText: "Request Canceled", data: error.message };
  }
  return _.pick(error.response, ["status", "statusText", "data"]);
};

export const setAuthorizationToken = (token: string | null) => {
  if (token) {
    mainAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete mainAxios.defaults.headers.common["Authorization"];
  }
};

// Refresh access token function
export const refreshAccessToken = async (): Promise<void> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) throw new Error('No access token available');
    const response = await mainAxios.post('/Auth/RefreshToken');
    const user = response.data;
    // Store new access token
    localStorage.setItem('accessToken', user["accessToken"])
    localStorage.setItem('expireDate', user["expireDate"])
    localStorage.setItem('expiresIn', user["expiresIn"])
    localStorage.setItem('roleID', user["roleID"])
    localStorage.setItem('userID', user["userID"])
    localStorage.setItem('userName', user["userName"])
    setAuthorizationToken(user["accessToken"]);
  } catch (error) {
    localStorage.clear();
    window.location.href = "/login";
  }
};

