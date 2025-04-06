// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {sql} from "drizzle-orm";
import {boolean, date, integer, pgTableCreator, serial, timestamp, varchar,} from "drizzle-orm/pg-core";
import {bookingTypeEnum} from "~/types";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `hytta-t3_${name}`);

export const bookings = createTable("booking", {
    id: serial().primaryKey(),
    cabinId: integer()
        .references(() => cabins.id)
        .notNull(),
    userId: varchar({length: 32}).notNull(),
    userName: varchar({length: 64}),
    createdAt: timestamp({withTimezone: true})
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    updatedAt: timestamp({withTimezone: true})
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    bookingType: bookingTypeEnum().notNull(),
    fromDate: date().notNull(),
    toDate: date().notNull(),
    description: varchar({length: 256}),
});

export const cabins = createTable("cabin", {
    id: serial().primaryKey(),
    ownerId: varchar({length: 32}).notNull(),
    name: varchar({length: 64}),
    createdAt: timestamp({withTimezone: true})
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    updatedAt: timestamp({withTimezone: true})
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    imageLink: varchar({length: 128}),
    description: varchar({length: 256}),
    address: varchar({length: 64}),
    gmapsLink: varchar({length: 128}),
    isPubliclyViewable: boolean().default(false).notNull(),
    isPubliclyWriteable: boolean().default(false).notNull(),
});
