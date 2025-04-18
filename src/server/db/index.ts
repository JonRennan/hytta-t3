import {sql} from "@vercel/postgres";
import {drizzle} from "drizzle-orm/vercel-postgres";

import * as schema from "./schema";

// Use this object to send drizzle queries to your DB
export const db = drizzle(sql, {schema: schema, casing: "snake_case"});
