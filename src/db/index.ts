import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const dbClient = postgres(process.env.DATABASE_URL as string, { max: 1 });
const db = drizzle(dbClient, { schema,});

export default db;
