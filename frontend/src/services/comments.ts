import axios from 'axios';

import { host } from '@/config/config';

export const post_comment = async ({ post_id, comment }: { post_id: string; comment: string }) => {
  const res = await axios.post(`${host}/comment/new`, { post_id, comment });
  return res.data;
};
