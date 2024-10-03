import { date } from "joi";
import { PostsService } from "../services/posts.service";
import { BaseController } from "./base.controller";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { ObjectId } from "mongodb";
import { IPosts } from "../routes/posts/postsModel";
import { request } from "http";

export class PostsController extends BaseController {
  postsService!: PostsService;
  constructor() {
    super();
    this.postsService = new PostsService("posts");
  }

  async getPost(request: Request, h: ResponseToolkit) {
    try {
      const post = await this.postsService.getPost(request.params.id);
      return h.response({ success: false, data: post }).code(200);
    } catch (error) {
      return this.handleErrorResponse(error, h);
    }
  }

  async getFriendsPosts(request: Request, h: ResponseToolkit) {
    try {
      const friends: ObjectId[] = request.params.friends;
      const posts = await this.postsService.getAllFriendsPosts(friends);
      return h.response({ success: true, data: posts });
    } catch (error) {
      return this.handleErrorResponse(error, h);
    }
  }

  async getAllUsersPosts(request: Request, h: ResponseToolkit) {
    const userId = request.params.userId;

    try {
      this.postsService.getAllUsersPosts(new ObjectId(userId));
    } catch (error) {
      return this.handleErrorResponse(error, h);
    }
  }
}
