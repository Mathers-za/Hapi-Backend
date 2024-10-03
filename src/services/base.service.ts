import { Document, MongoClient, ObjectId, OptionalId } from "mongodb";
import { IPosts } from "../routes/posts/postsModel";

export class BaseService<T> {
  mongoDbClient!: MongoClient;
  protected readonly database = "twitterKnockOff";
  constructor(protected collection: string) {
    this.mongoDbClient = new MongoClient(process.env.URI as string);
  }

  async findById(id: ObjectId) {
    return await this.mongoDbClient
      .db(this.database)
      .collection(this.collection)
      .findOne({ _id: id });
  }

  async createDocument(document: OptionalId<Document>) {
    return this.mongoDbClient
      .db(this.database)
      .collection(this.collection)
      .insertOne(document);
  }
}
