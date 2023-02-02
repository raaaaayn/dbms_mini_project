import axios from 'axios';

import { host } from '@/config/config';

const post_new = async (post: { content: string; image_url: string }) => {
  const res = await axios.post(`${host}/post/new`, post);
  return res.data;
};

const like_post = async (post_id: string) => {
  const res = await axios.post(`${host}/post/like`, { post_id });
  return res.data;
};

const unlike_post = async (post_id: string) => {
  const res = await axios.post(`${host}/post/unlike`, { post_id });
  return res.data;
};

const get_post_details = async (
  post_id: string,
): Promise<{
  post: {
    id: string;
    date: string;
    number_likes: string;
    number_comments: string;
    poster: string;
    image_url: string;
    content: string;
    liked_by_post: string;
  };
  comments: Array<{ username: string; comment: string; profile_pic: string }>;
  likes: Array<{ username: string }>;
}> => {
  const res = await axios.get(`${host}/post/get/${post_id}`);
  return res.data;
};

export { post_new, like_post, unlike_post, get_post_details };
