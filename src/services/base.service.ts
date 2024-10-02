import { MongoClient, ObjectId } from "mongodb";

export class BaseService<T> {
  mongoDbClient!: MongoClient;
  protected readonly database = "twitterKnockOff";
  constructor() {
    this.mongoDbClient = new MongoClient(process.env.URI as string);
  }
}
