import { PORT } from "./config";
import build_app from "./app";

const app = build_app({ logger: true });

app.listen({ port: parseInt(PORT) || 3001, host: "0.0.0.0" }).catch((err) => {
	console.log(err);
	process.exit(1);
});
