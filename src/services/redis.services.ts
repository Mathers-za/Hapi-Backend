import * as redis from "redis";
import { MongoError } from "mongodb";
import { RedisError } from "../errors/redis.errors";
import { createClient } from "@redis/client";
import RedisClient from "@redis/client/dist/lib/client";
export class RedisService {
  private static _redisClient: redis.RedisClientType;

  static get redisClient() {
    if (!RedisService._redisClient) {
      RedisService._redisClient = redis.createClient();
    }
    return RedisService._redisClient;
  }

  constructor() {
    //makes sure that we are working with a single redisClient connection
    RedisService.redisClient;
  }

  async getOrSetReadsCache<T>(
    key: string,
    mongoDbOperationCallback: () => Promise<T>,
    expirationSeconds: number = 600
  ) {
    try {
      const cachedData = await RedisService._redisClient.get(key);
      if (cachedData) {
        return JSON.parse(cachedData);
      } else {
        const dataFromDb = await mongoDbOperationCallback();
        RedisService._redisClient.setEx(
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
      await Promise.all(key.map((el) => RedisService._redisClient.del(el)));
    } else {
      await RedisService._redisClient.del(key);
    }
  }
}
