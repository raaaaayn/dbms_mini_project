import axios from "axios";

import { host } from "@/config/config";

const username_exists = async (username: string): Promise<boolean> => {
  const res = await axios.get(`${host}/username_exists?username=${username}`);
  return res.data;
};

export default username_exists;
