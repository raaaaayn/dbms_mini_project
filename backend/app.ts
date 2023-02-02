import fastifyCors from "@fastify/cors";
import websocketPlugin from "@fastify/websocket";
import fastify from "fastify";
import { login, register } from "./routes/auth";
import comments from "./routes/comments";
import search from "./routes/get_posts";
import users from "./routes/users";
import posts from "./routes/posts";
import username_exists from "./routes/username_exists";
import websocket_route from "./routes/ws";

declare module "fastify" {
  export interface FastifyRequest {
    username?: string;
  }
}

export const clients: any = [];

const build_app = (opts = {}) => {
  const app = fastify(opts);
  app.register(fastifyCors);
  app.register(websocketPlugin);
  app.register(login, { prefix: "/login" });
  app.register(register, { prefix: "/register" });
  app.register(search, { prefix: "/search" });
  app.register(users, { prefix: "/user" });
  app.register(username_exists, { prefix: "/username_exists" });
  app.register(posts, { prefix: "/post" });
  app.register(comments, { prefix: "/comment" });
  app.register(websocket_route, { prefix: "/ws" });
  return app;
};

export default build_app;
