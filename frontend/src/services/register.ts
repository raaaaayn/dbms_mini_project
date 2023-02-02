import axios from "axios";

import { host } from "@/config/config";

const register = async ({
  username,
  name,
  email,
  dob,
  password,
  account_type,
  profile_pic,
}: {
  username: string;
  name: string;
  email: string;
  dob: string;
  password: string;
  account_type: boolean;
  profile_pic: string | null;
}) => {
  const res = await axios.post(`${host}/register`, {
    username,
    name,
    email,
    dob,
    password,
    account_type,
    profile_pic,
  });
  console.log(res.data.token);
  localStorage.setItem("token", res.data.token);
  axios.defaults.headers.common = {
    Authorization: `Bearer ${res.data.token}`,
  };
  return res.data;
};

export default register;
