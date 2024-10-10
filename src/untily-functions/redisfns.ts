import { RedisService } from "../services/redis.services";

export async function getOrSetRedisCache(
  key: string,
  fetchDataCallBack: () => Promise<any>,
  expirationSeconds: number | undefined = 300
): Promise<object> {
  const redisClient = RedisService.redisClient;
  return new Promise(async (resolve, reject) => {
    try {
      const data = await redisClient.get(key);
      if (data) {
        resolve(JSON.parse(data));
      } else {
        const data = await fetchDataCallBack();
        await redisClient.setEx(key, expirationSeconds, JSON.stringify(data));
        resolve(data);
      }
    } catch (error: any) {
      reject({
        message: "A redis error occurred",
        error: error.message,
      });
    }
  });
}
