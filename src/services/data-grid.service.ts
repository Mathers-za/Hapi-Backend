import { skip } from "node:test";
import { BaseService } from "./base.service";

export default class DataGridService extends BaseService<any> {
  constructor(protected collection: string) {
    super(collection);
  }

  async pagination(skip: number, take: number) {
    const totalCount = await this.mongoDbClient
      .db(this.database)
      .collection(this.collection)
      .countDocuments();
    const results = await this.mongoDbClient
      .db(this.database)
      .collection(this.collection)
      .aggregate([
        {
          $skip: skip,
        },
        {
          $limit: take,
        },
      ])
      .toArray();

    return { data: results, totalCount: totalCount };
  }
}
