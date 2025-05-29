const { createClient } = require('redis');

async function connectRedis() {
  const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
      host:  process.env.REDIS_HOST,
      port: 10886,
    },
  });

  client.on('error', (err) => console.error('Redis Client Error', err));

  await client.connect();

  await client.set('foo', 'bar');
  const result = await client.get('foo');
  console.log(result);
}

connectRedis();