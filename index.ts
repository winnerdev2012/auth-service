/* eslint-disable @typescript-eslint/no-var-requires */
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { logConfig } from './logs/configuration';

// dotenv configuration
dotenv.config();

// mongoose connection
mongoose
  .connect(process.env.DB_URL ?? '')
  .catch((err) => {
    console.log(err);
    process.exit(1);
  })
  .finally(() => {
    console.log('Connected to database');
  });

// fastify server configuration
const server = Fastify({
  logger: logConfig[(process.env.ENV ?? ('development' as string)) as keyof typeof logConfig],
}).withTypeProvider<TypeBoxTypeProvider>();

server.register(cors, {
  origin: '*',
});
server.register(require('./routes/v1'), { prefix: 'v1' });

server.listen({ host: '0.0.0.0', port: (process.env.PORT as number | undefined) ?? 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
