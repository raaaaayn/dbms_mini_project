import sql from "../db";

const get_search_results = async (
  search_string: string,
): Promise<Array<{ username: string; name: string }>> => {
  const res: any = await sql`
							SELECT username,name FROM "user" 
							WHERE username like LOWER(${"%" + search_string + "%"}) 
								OR LOWER(name) like LOWER(${"%" + search_string + "%"}) 
							ORDER BY username LIMIT ${10} `;
  return res;
};

export default get_search_results;
