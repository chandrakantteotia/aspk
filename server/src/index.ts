import 'dotenv/config';
import app from './app.js';
import { connectMongo } from './lib/mongo.js';

const port = Number(process.env.PORT ?? 4000);

async function bootstrap() {
  await connectMongo(process.env.MONGODB_URI);

  app.listen(port, () => {
    console.log(`ASPK4Hapur API listening on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
