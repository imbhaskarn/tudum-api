import { pgTable, uuid, text, varchar, timestamp } from 'drizzle-orm/pg-core';

export const User = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  lastLogin: timestamp('last_login').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});
