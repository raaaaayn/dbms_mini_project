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
	upload_pic
}: {
	username: string;
	name: string;
	email: string;
	dob: string;
	password: string;
	account_type: boolean;
	profile_pic: string | null;
	upload_pic: any
}) => {
	const formData = new FormData();
	// formData.append("body", JSON.stringify({
	// 	username, name, email, dob, password, account_type, profile_pic
	// }))
	formData.append("username", username)
	formData.append("name", name)
	formData.append("email", email)
	formData.append("dob", dob)
	formData.append("password", password)
	formData.append("account_type", JSON.stringify(account_type))
	formData.append("profile_pic", JSON.stringify(profile_pic))
	formData.append('file', upload_pic);

	const res = await axios.post(`${host}/register`, formData);

	console.log(res.data.token);
	localStorage.setItem("token", res.data.token);
	axios.defaults.headers.common = {
		Authorization: `Bearer ${res.data.token}`,
	};
	return res.data;
};

export default register;
