import api from "../../api";


// account
function login(params: { username: string; password: string }) {
  const baseUrl = "/Auth/SignIn";
  return api.post(`${baseUrl}`, params);
}

function logout() {
  const baseUrl = "/logout/";
  return api.post(`${baseUrl}`, {});
}

function signup(params: { fullname: string; email: string; password: string }) {
  const baseUrl = "/register/";
  return api.post(`${baseUrl}`, params);
}

function forgotPassword(params: { username: string }) {
  const baseUrl = "/forgot-password/";
  return api.post(`${baseUrl}`, params);
}

export { login, logout, signup, forgotPassword };
