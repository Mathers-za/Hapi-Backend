import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import userRoutes from "./routes/user/user";
import { server } from "@hapi/hapi";

dotenv.config();

export const client = new MongoClient(process.env.URI as string, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const db = client.db("twitterKnockOff");

export const run = async () => {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    return client;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
