import sql from "../db";

const get_user = async (
  username: string,
  otherusername: string,
): Promise<
  Array<{
    username: string;
    name: string;
    posts_count: number;
    posts: Array<any>;
  }>
> => {
  const user_res: any = await sql`
							SELECT U.username, U.name, count(P.id) as posts_count, U.profile_pic FROM "user" U 
								LEFT JOIN posts P on U.username = P.poster
								LEFT JOIN comments C on P.id = C.post_id
							WHERE username = ${username}
							GROUP BY U.username
							`;

  const user_deets = user_res[0];

  const posts_res = await sql`
							SELECT id, date, number_likes, number_comments, poster, image_url, content  FROM posts
							WHERE poster = ${username}
							ORDER BY id desc
							`;

  const posts_id = posts_res.map((p) => p.id);

  const comments = await sql`
							select
								post_id, commenter as username, comment
							from comments
							where post_id in ${sql(posts_id)}
							`;

  const likes = await sql`
							select
								post_id, liked_by as username
							from likes
							where post_id in ${sql(posts_id)}
							`;

  const liked_by_user = likes.filter((like) => like.username === otherusername);

  const posts: any[] = posts_res.map((post) => {
    const related_comments = comments.filter(
      (comment) => comment.post_id === post.id,
    );
    const related_likes = likes.filter((like) => like.post_id === post.id);
    return { ...post, comments: related_comments, likes: related_likes };
  });

  posts.forEach((post: any, idx) => {
    const like = liked_by_user.find((like) => like.post_id === post.id);
    if (like) {
      const postIdx = posts.findIndex((post) => post.id === like.post_id);
      posts[postIdx].liked_by_post = true;
    } else {
      posts[idx].liked_by_post = false;
    }
  });

  return { ...user_deets, posts };
};

export default get_user;
