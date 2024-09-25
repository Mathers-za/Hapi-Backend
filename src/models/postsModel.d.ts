import { ObjectId } from "mongodb";

export interface IPosts {
  _id: ObjectId;
  content: string;
  userId: string;
  comments: IComments[];
}

export interface IComments {
  _id: ObjectId;
  content: string;
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
