import sql from "../db"

const create_post = async (username: string, content: string, image_url: string) => {
	await sql`
							INSERT INTO posts
								(date,number_likes,number_comments,poster,content,image_url)
							VALUES
								(${new Date().toISOString().slice(0, 19).replace('T', ' ')},0,0,${username},${content},${image_url})
							`;
	return;
};

const like_post = async (username: string, post_id: string) => {
	await sql.begin(sql => [
		sql`
							UPDATE posts 
								SET number_likes = number_likes + 1,
										liked_by_post = (CASE
																					WHEN posts.poster = ${username} THEN TRUE
																					ELSE FALSE
																		 END)
								WHERE posts.id = ${post_id};
							`,
		sql`
							INSERT INTO likes
								(post_id,liked_by)
							VALUES 
								(${post_id},${username})
		`
	])
	return;
}

const unlike_post = async (username: string, post_id: string) => {
	await sql.begin(async sql => {
		const delete_res = await sql`
							DELETE FROM likes
							WHERE post_id=${post_id} AND liked_by=${username}

							returning *
		`;

		if (delete_res.length > 0) {
			await sql`
							UPDATE posts 
								SET number_likes = number_likes - 1,
										liked_by_post = (CASE
																					WHEN posts.poster = ${username} THEN FALSE
																					ELSE TRUE
																		 END)
								WHERE posts.id = ${post_id};
							`
		}
		else { throw new Error("post has not been liked by user"); }
	})
	return;
}

const get_post_details = async (post_id: string) => {
	const post = await sql`
											SELECT P.id,date,number_likes,number_comments,poster,image_url,content,liked_by_post from posts P
											WHERE P.id = ${post_id}
							`;

	const comments = await sql`
											select commenter as username, comment, U.profile_pic from comments C
												inner join "user" U on  U.username = C.commenter
											where post_id = ${post_id}
							`;

	const likes = await sql`
											select
												liked_by as username
											from likes
											where post_id = ${post_id}
							`;

	return { post: post[0], comments, likes };

}

const get_user_feed = async (username: string) => {
	const res = await sql`
							SELECT * FROM posts P
							WHERE P.poster = ${username}
							`;
	return res;
};

export { create_post, get_user_feed, like_post, unlike_post, get_post_details };
