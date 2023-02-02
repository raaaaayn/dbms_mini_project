import axios from "axios";

import { host } from "@/config/config";

const login = async ({ username, password }: { username: string; password: string }) => {
  const res = await axios.post(`${host}/login`, { username, password });
  console.log(res.data.token);
  localStorage.setItem("token", res.data.token);
  axios.defaults.headers.common = {
    Authorization: `Bearer ${res.data.token}`,
  };
  return res.data;
};

export default login;
