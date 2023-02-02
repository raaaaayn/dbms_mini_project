import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config"

const verify_jwt = async (request: FastifyRequest, reply: FastifyReply, payload: any) => {
	const bearer = request.headers.authorization;
	if (!bearer) {
		reply.code(400).send({ message: "Auth token missing" });
		return reply;
	}
	if (bearer.toLowerCase().startsWith("bearer")) {
		console.log("yeah");
		const token = bearer.split(" ")[1];
		jwt.verify(token, JWT_SECRET, async (err, jwt_res) => {
			if (err) {
				console.log(err);
				await reply.code(401).send({ message: "Invalid Token, please obtain a new token" });
			}
			if (typeof (jwt_res) !== 'string')
				request.username = jwt_res?.username as string;
		});
	} else {
		await reply.code(400).send({ message: "Invalid Token format" });
	}

	return payload;
};

export default verify_jwt;
