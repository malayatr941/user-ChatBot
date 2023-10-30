const redis = require('redis');

class Redis {
  public client: any;

  constructor() {
    this.startRedis();
  }
  public async startRedis() {
    this.client = redis.createClient({
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
      url: 'redis://' + 'localhost' + ':' + 6379,
    });
    this.client.on('error', (err: any) => console.log('Redis Client Error ' + err));
    await this.client.connect();
    console.log('Redis Connected Successfully');
  }
}
export default new Redis();
