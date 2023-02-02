import { FastifyInstance, FastifyPluginOptions } from "fastify";
import verify_jwt from "../util/verify_jwt";

const multer = require('fastify-multer') // or import multer from 'fastify-multer'
const upload = multer({ dest: '/home/day/dbms_mini_project_images/assets' })

const upload_pics = (
	fastify: FastifyInstance,
	opts: FastifyPluginOptions,
	next: any,
) => {
	fastify.get(
		"/",
		{
			...opts,
			preHandler: verify_jwt,
		},
		async (request, reply) => {

		},
	);

	next();
}

export default upload_pics;
