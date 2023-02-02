import { FastifyInstance, FastifyPluginOptions } from "fastify";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import multer from 'fastify-multer';

import sql from "../db";
import { JWT_SECRET } from "../config";


const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, '/home/day/Pictures/dbms_mini_project_images/assets')
	},
})
const upload = multer({ storage })

const saltRounds = 10;

type BodyUserType = {
	username: string;
	password: string;
	name: string;
	email: string;
	dob: string;
	account_type: boolean;
	profile_pic: string;
};

const register = async (
	fastify: FastifyInstance,
	opts: FastifyPluginOptions,
	next: any,
) => {
	fastify.post<{ Body: BodyUserType }>(
		"/",
		{
			preValidation: upload.single('file'),
			schema: {
				body: {
					username: { type: "string" },
					password: { type: "string" },
					name: { type: "string" },
					email: { type: "string" },
					dob: { type: "string" },
					account_type: { type: "boolean" },
					profile_pic: { type: "string" },
				},
			},
		},
		async (req, reply) => {
			const {
				username,
				name,
				email,
				dob,
				password,
				account_type,
				profile_pic,
			} = req.body;
			// @ts-ignore 
			const file = req.file as unkown;

			const filename = `http://localhost:3001/images/${file.filename}` as string;

			const hash = await bcrypt.hash(password, saltRounds);
			const account_type_string = account_type ? "private" : "public";
			try {
				await sql.begin(async (sql) => {
					const statement = sql`
					insert into "user"
						("username", name, dob, email, account_type, profile_pic)
					values
						(LOWER(${username}), ${name}, ${dob}, ${email}, ${account_type_string}, ${filename});
					`;
					await statement;
					await sql`
					insert into login_deets
						("username", hash)
					values
						(LOWER(${username}), ${hash})
					`;
					jwt.sign(
						{ username, name },
						JWT_SECRET,
						async (err: any, token: any) => {
							await reply.send({ token });
							if (err) {
								await reply.code(500);
							}
						},
					);
				});
			} catch (err) {
				if (
					err instanceof Error &&
					err.message ===
					'duplicate key value violates unique constraint "user_pkey"'
				)
					await reply.code(400).send({ message: "user exists" });
				throw err;
			}
			return reply;
		},
	);
	next();
};

const login = (
	fastify: FastifyInstance,
	opts: FastifyPluginOptions,
	next: any,
) => {
	fastify.route<{ Body: BodyUserType }>({
		method: "POST",
		url: "/",
		schema: {
			body: {
				username: { type: "string" },
				password: { type: "string" },
			},
		},
		handler: async (req, reply) => {
			const { username, password } = req.body;
			const stored_hash =
				await sql`select hash from login_deets where "username"=LOWER(${username})`;
			if (stored_hash.length > 0) {
				const result = await bcrypt.compare(password, stored_hash[0].hash);
				if (result) {
					jwt.sign(
						{
							username,
						},
						JWT_SECRET,
						{ expiresIn: "1h" },
						function(err, token) {
							if (err) {
								console.error({ err });
								reply.code(500).send(err);
							}
							reply.send({ token });
						},
					);
				} else {
					console.log("not succ");
					reply.code(401).send({ message: "Invalid usernama or password" });
				}
			} else {
				reply.code(401).send({ message: "Invalid usernama or password" });
			}
			return reply;
		},
	});
	next();
};

export { register, login };
