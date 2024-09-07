// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  date,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { bookingTypeEnum } from "~/types";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `hytta-t3_${name}`);

export const bookings = createTable("booking", {
  id: serial("id").primaryKey(),
  byId: varchar("user_id", { length: 256 }).notNull(),
  byName: varchar("user_name", { length: 256 }),
  createdAt: timestamp("created_at", { withTimezone: true }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  bookingType: bookingTypeEnum("type").notNull(),
  fromDate: date("from_date").notNull(),
  toDate: date("to_date").notNull(),
  description: varchar("description", { length: 256 }),
  participants: varchar("participants", { length: 1024 }),
});
