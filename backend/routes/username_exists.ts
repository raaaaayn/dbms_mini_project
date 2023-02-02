import {
  FastifyInstance,
  FastifyPluginOptions,
  RequestGenericInterface,
} from "fastify";
import get_username_exists from "../services/username_exists";

interface usernameQuery extends RequestGenericInterface {
  Querystring: {
    username: string;
  };
}

const username_exists = (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
  next: any,
) => {
  fastify.get<usernameQuery>("/", opts, async (request, reply) => {
    const search_string = request.query.username;
    if (search_string) {
      const res = await get_username_exists(search_string);
      return res;
    }
    return false;
  });
  next();
};

export default username_exists;
