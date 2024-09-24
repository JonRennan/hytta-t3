// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  date,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  boolean,
  integer,
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
  cabinId: integer("cabin_id")
    .references(() => cabins.id)
    .notNull(),
  byId: varchar("user_id", { length: 256 }).notNull(),
  byName: varchar("user_name", { length: 256 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  bookingType: bookingTypeEnum("type").notNull(),
  fromDate: date("from_date").notNull(),
  toDate: date("to_date").notNull(),
  description: varchar("description", { length: 256 }),
  participants: varchar("participants", { length: 1024 }),
});

export const cabins = createTable("cabin", {
  id: serial("id").primaryKey(),
  owner: varchar("owner_id", { length: 256 }).notNull(),
  name: varchar("name", { length: 256 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  imageLink: varchar("image_link", { length: 256 }),
  description: varchar("description", { length: 1024 }),
  address: varchar("address", { length: 256 }),
  gmapsLink: varchar("gmaps_link", { length: 256 }),
  isPubliclyViewable: boolean("publicly_viewable").default(false).notNull(),
  isPubliclyWriteable: boolean("publicly_writeable").default(false).notNull(),
});
