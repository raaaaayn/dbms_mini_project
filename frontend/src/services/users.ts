import axios from 'axios';

import { host } from '@/config/config';

export type Post = {
	id: string;
	date: string;
	number_likes: string;
	number_comments: string;
	poster: string;
	image_url: string;
	content: string;
	comments: Array<{
		post_id: string;
		username: string;
		comment: string;
	}>;
	likes: Array<{
		post_id: string;
		username: string;
	}>;
	liked_by_post: boolean;
};

export type User = {
	name: string;
	username: string;
	posts_count: number;
	profile_pic: string;
	posts: Array<Post>;
};

export const get_user = async (): Promise<User> => {
	const res = await axios.get(`${host}/user`);
	return res.data;
};

export const get_other_user = async (username: string): Promise<User> => {
	const res = await axios.get(`${host}/user/${username}`);
	return res.data;
};

export const get_all_users = async (): Promise<User[]> => {
	const res = await axios.get(`${host}/user/all`);
	return res.data;
};

