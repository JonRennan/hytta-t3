import "server-only";
import { db } from "~/server/db";

export async function getBookings() {
  return db.query.bookings.findMany({
    orderBy: (model, { asc }) => asc(model.fromDate),
  });
}
