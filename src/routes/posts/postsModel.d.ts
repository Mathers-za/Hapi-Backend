import { ObjectId } from "mongodb";

export interface IPostsBase {
  content: string;
  userId: string;
  comments: IComments[];
}

export interface IPosts extends IPostsBase {
  id: ObjectId;
}

export interface IComments {
  _id: ObjectId;
  content: string;
  userId: ObjectId;
}
