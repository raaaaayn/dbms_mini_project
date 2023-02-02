import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { post_comment } from "../services/comments_serives";
import verify_jwt from "../util/verify_jwt";

const comments = (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
  next: any,
) => {
  fastify.post<{ Body: { post_id: string; comment: string } }>(
    "/new",
    {
      ...opts,
      preHandler: verify_jwt,
      schema: {
        body: {
          post_id: { type: "string" },
          comment: { type: "string" },
        },
      },
    },
    async (request, reply) => {
      console.log("posting new comment");
      const username = request.username as string;
      const { post_id, comment } = request.body;
      const res = await post_comment(post_id, username, comment);
      return res;
    },
  );

  next();
};

export default comments;
