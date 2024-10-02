import { Collection, Document, ObjectId, WithId } from "mongodb";
import { IPosts } from "../routes/posts/postsModel";
import { BaseService } from "./base.service";
import { IUser } from "../routes/user/userModel";

export class PostsService extends BaseService<IPosts> {
  constructor(private collection: string) {
    super();
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
}
