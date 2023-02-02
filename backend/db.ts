import { CONNECTION_STRING } from "./config";
import postgres from "postgres";
import { clients } from "./app";

const sql = postgres(CONNECTION_STRING, {});

sql
  .subscribe(
    "*",
    (row, { command, relation }) => {
      for (const client of clients) {
        client.send(
          JSON.stringify({
            row,
            command,
            relation,
          }),
        );
      }
      console.log({
        row,
        command,
      });
    },
    () => {
      // Callback on initial connect and potential reconnects
    },
  )
  .then(({ unsubscribe }) => {});

export default sql;
