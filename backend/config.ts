const CONNECTION_STRING = process.env.POSTGRES as string;
const PORT = process.env.PORT as string;
const JWT_SECRET = process.env.JWT_SECRET as string;

if (!CONNECTION_STRING) throw "POSTGRES env variable not set";
if (!JWT_SECRET) throw "JWT_SECRET not set";

export { CONNECTION_STRING, PORT, JWT_SECRET };
