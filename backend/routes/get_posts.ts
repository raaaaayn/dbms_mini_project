import {
  FastifyInstance,
  FastifyPluginOptions,
  RequestGenericInterface,
} from "fastify";
import get_search_results from "../services/get_search_results";

interface searchQuery extends RequestGenericInterface {
  Querystring: {
    username: string;
  };
}

const search = (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
  next: any,
) => {
  fastify.get<searchQuery>("/", opts, async (request, reply) => {
    const search_string = request.query.username;
    if (search_string) {
      const res = await get_search_results(search_string);
      return JSON.stringify(res, null, 2);
    }
    return "no query string";
  });
  next();
};

export default search;
