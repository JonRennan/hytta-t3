import "server-only";
import { db } from "~/server/db";

const today = new Date();

export async function getBookings() {
  return db.query.bookings.findMany({
    orderBy: (booking, { asc }) => asc(booking.fromDate),
  });
}

export async function getFutureBookings() {
  return db.query.bookings.findMany({
    where: (booking, { gte }) => gte(booking.toDate, today),
    orderBy: (booking, { asc }) => asc(booking.fromDate),
  });
}
