import Redis from "redis";
import { MongoError } from "mongodb";
export class RedisService {
  protected readonly redisClient = Redis.createClient();

  async getOrSetReadsCache<T>(
    key: string,
    mongoDbOperationCallback: () => Promise<T>,
    expirationSeconds: number = 600
  ) {
    try {
      const cachedData = await this.redisClient.get(key);
      if (cachedData) {
        return JSON.parse(cachedData);
      } else {
        const dataFromDb = await mongoDbOperationCallback();
        this.redisClient.setEx(
          key,
          expirationSeconds,
          JSON.stringify(dataFromDb)
        );
        return dataFromDb;
      }
    } catch (error) {
      if (!(error instanceof MongoError)) {
        throw new RedisError("A redis error occurred");
      }
    }
  }

  async refreshCachedDataByKeyOrKeys(key: string | string[]): Promise<void> {
    if (Array.isArray(key)) {
      await Promise.all(key.map((el) => this.redisClient.del(el)));
    } else {
      await this.redisClient.del(key);
    }
  }
}
