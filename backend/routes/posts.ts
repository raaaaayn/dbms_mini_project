import { FastifyInstance, FastifyPluginOptions } from "fastify";
import multer from 'fastify-multer';
import {
	create_post,
	get_post_details,
	get_user_feed,
	like_post,
	unlike_post,
} from "../services/posts_services";
import verify_jwt from "../util/verify_jwt";

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, '/home/day/Pictures/dbms_mini_project_images/assets')
	},
})
const upload = multer({ storage })


const posts = (
	fastify: FastifyInstance,
	opts: FastifyPluginOptions,
	next: any,
) => {
	fastify.get(
		"/get/:id",
		{
			...opts,
			preHandler: verify_jwt,
		},
		async (request, reply) => {
			const params = request.params as { id: string };
			const post_id = params.id;
			const res = await get_post_details(post_id);
			reply.send(res);
		},
	);

	fastify.post<{
		Body: {
			content: string;
			image_url: string;
		};
	}>(
		"/new",
		{
			...opts,
			preValidation: upload.single('file'),
			preHandler: verify_jwt,
			schema: {
				body: {
					content: { type: "string" },
					image_url: { type: "string" },
				},
			},
		},
		async (request, reply) => {
			// @ts-ignore 
			const file: any = request.file;
			const filename = `http://localhost:3001/images/${file.filename}` as string;
			const username = request.username as string;
			const { content } = request.body;
			await create_post(username, content, filename);
			reply.code(200);
		},
	);

	fastify.post<{
		Body: { post_id: string };
	}>(
		"/like",
		{
			...opts,
			preHandler: verify_jwt,
			schema: {
				body: {
					post_id: { type: "string" },
				},
			},
		},
		async (request, reply) => {
			const username = request.username as string;
			await like_post(username, request.body.post_id);
			reply.code(200);
		},
	);

	fastify.post<{
		Body: { post_id: string };
	}>(
		"/unlike",
		{
			...opts,
			preHandler: verify_jwt,
			schema: {
				body: {
					post_id: { type: "string" },
				},
			},
		},
		async (request, reply) => {
			const username = request.username as string;
			await unlike_post(username, request.body.post_id);
			reply.code(200);
		},
	);

	fastify.get(
		"/feed",
		{ ...opts, preHandler: verify_jwt },
		async (request, reply) => {
			const username = request.username as string;
			const res = await get_user_feed(username);
			reply.send(res);
		},
	);
	next();
};

export default posts;
