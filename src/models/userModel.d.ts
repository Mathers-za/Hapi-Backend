import { ObjectId } from "mongodb";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  friends: ObjectId[];
}

export interface IRegisterUser extends IUser {
  passwordConfirm?: string;
}
