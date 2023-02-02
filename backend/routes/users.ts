import { FastifyInstance, FastifyPluginOptions } from "fastify";
import get_user from "../services/get_user";
import { get_users } from "../services/user_services";
import verify_jwt from "../util/verify_jwt";

const users = (fastify: FastifyInstance, opts: FastifyPluginOptions, next: any) => {
	fastify.get("/", { ...opts, preValidation: verify_jwt }, async (request, reply) => {
		const username = request.username;
		if (username) {
			const res = await get_user(username, username);
			return res
		}
		return { message: "no user found" }
	});

	fastify.get("/:username", { ...opts, preValidation: verify_jwt }, async (request, reply) => {
		const params = request.params as { username: string };
		const username = params.username;
		if (username && request.username) {
			const res = await get_user(username, request.username);
			return res
		}
		return { message: "no user found" }
	});

	fastify.get("/all", { ...opts, preValidation: verify_jwt }, async (request, reply) => {
		const res = await get_users();
		return res.filter((user) => user.username !== request.username);
	});

	next();
};

export default users;
