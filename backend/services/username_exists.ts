import sql from "../db"

const get_username_exists = async (username: string): Promise<boolean> => {
	const res =
		await sql`
							SELECT username FROM "user" 
							WHERE username = LOWER(${username}) 
							`;
	console.log({res});
	if (res.length > 0) return true
	return false;
};

export default get_username_exists;
