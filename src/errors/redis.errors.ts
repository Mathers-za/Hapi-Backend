class RedisError extends Error {
  readonly name = "RedisError";
  constructor(message: undefined | string = "Redis error occurred") {
    super(message);
  }
}
