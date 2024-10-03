import { Collection, Document, ObjectId, WithId } from "mongodb";
import { IPosts, IPostsBase } from "../routes/posts/postsModel";
import { BaseService } from "./base.service";
import { IUser } from "../routes/user/userModel";
import { RedisService } from "./redis.services";

export class PostsService extends BaseService<IPosts | IPostsBase> {
  redisService: RedisService = new RedisService();
  constructor(collection: string) {
    super(collection);
  }

  async getPost(id: ObjectId) {
    return await this.mongoDbClient
      .db(this.database)
      .collection(this.collection)
      .findOne({ _id: id });
  }

  async getAllFriendsPosts(friends: ObjectId[]) {
    return await this.mongoDbClient
      .db(this.database)
      .collection(this.collection)
      .find({ _id: { $in: friends } })
      .toArray();
  }

  async getAllUsersPosts(userId: ObjectId) {
    return this.redisService.getOrSetReadsCache(`usersPosts${userId}`, () => {
      return this.mongoDbClient
        .db(this.database)
        .collection(this.collection)
        .find({ userId: userId })
        .toArray();
    });
  }

  async createPosts(document: IPostsBase) {
    return await this.createDocument(document);
  }
}
