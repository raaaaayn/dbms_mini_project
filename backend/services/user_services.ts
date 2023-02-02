import sql from "../db";

export const get_users = async () => {
  const users = await sql`select username,name,profile_pic from "user"`;
  return users;
};
