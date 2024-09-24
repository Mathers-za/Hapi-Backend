import hapi from "@hapi/hapi";
import dotenv from "dotenv";
import { run as mongoRun } from "./db-config";
import userRoutes from "./routes/user/user";
import { customNotFoundRoute } from "./routes/utilityRoutes";
import { client } from "./db-config";

dotenv.config();

const init = async () => {
  const server = hapi.server({
    host: process.env.Host,
    port: process.env.PORT,
    routes: {
      validate: {
        failAction: (request, h, error) => {
          throw error;
        },
      },
    },
  });

  await server.start();
  await mongoRun();
  server.route([...userRoutes, customNotFoundRoute]);
  console.log(`Server running on ${server.info.uri}`);
};

process.on("uncaughtException", (error) => {
  console.log(
    `An unhandled error occurred when starting the db, error: ${error}`
  );
});

process.on("SIGINT", async () => {
  console.log("Closing MongoDB connection");
  await client.close();
  console.log("MongoDB connection closed");
  process.exit(0);
});

init();
