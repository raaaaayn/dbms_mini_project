import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { clients } from "../app";

const websocket_route = (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
  next: any,
) => {
  fastify.get(
    "/",
    { websocket: true },
    (connection /* SocketStream */, req /* FastifyRequest */) => {
      console.log("new connection");
      clients.push(connection.socket);

      connection.socket.on("close", () => {
        console.log("ws closed");
      });
    },
  );

  next();
};

export default websocket_route;
