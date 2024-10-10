import hapi, { Request } from "@hapi/hapi";
import dotenv from "dotenv";
import { run as mongoRun } from "./db-config";
import userRoutes from "./routes/user/user";
import { customNotFoundRoute } from "./routes/utilityRoutes";
import { client, db } from "./db-config";
import cookieAuth from "@hapi/cookie";
import postsRoutes from "./routes/posts/postsRoutes";
import { ObjectId } from "mongodb";
import { gridRoutes } from "./routes/posts/grid.routes";
import { exit } from "node:process";
import { error } from "node:console";

dotenv.config();

const init = async () => {
  const server = hapi.server({
    host: process.env.Host,
    port: process.env.PORT,
    routes: {
      cors: true,
      validate: {
        failAction: (request, h, error) => {
          throw error;
        },
        options: { abortEarly: true, stripUnknown: true },
      },
    },
  });

  await server.register(cookieAuth);

  server.auth.strategy("session", "cookie", {
    redirectTo: "/login",
    cookie: {
      name: "sid",
      clearInvalid: false,
      isSecure: false,
      isHttpOnly: true,
      password: process.env.COOKIE_PASSWORD,
    },
    validate: async (request: Request, session: any) => {
      const id: ObjectId = session.id;
      const user = await db.collection("users").findOne({ _id: id });
      if (user?._id === session.id) {
        return { isValid: true, credentials: user };
      } else {
        return { isValid: false };
      }
    },
  });

  server.auth.default("session");

  server.route([
    ...userRoutes,
    customNotFoundRoute,
    ...postsRoutes,
    ...gridRoutes,
  ]);
  await server.start();
  await mongoRun();

  console.log(`Server running on ${server.info.uri}`);
};

process.on("uncaughtException", (error) => {
  console.log(
    `An unhandled error occurred when starting the db, error: ${error}`
  );

  process.exit(1);
});

process.on("SIGINT", async () => {
  console.log("Closing MongoDB connection");
  await client.close();
  console.log("MongoDB connection closed");
  process.exit(0);
});

process.on("unhandledRejection", (error) => {
  console.log("an unhandled rejection occurred");
  process.exit(1);
});

init();
