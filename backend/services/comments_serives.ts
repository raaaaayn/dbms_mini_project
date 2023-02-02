import sql from "../db";

const post_comment = async (
  post_id: string,
  username: string,
  comment: string,
) => {
  const res = await sql.begin(async (sql) => {
    await sql`
							INSERT INTO comments
								(post_id,commenter,comment)
							VALUES
								(${post_id},${username},${comment})
							`;

    await sql`
							UPDATE posts P
								set number_comments = number_comments + 1
							WHERE P.id = ${post_id}
		`;
  });
  return res;
};

export { post_comment };
