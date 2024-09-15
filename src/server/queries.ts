import "server-only";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { bookings } from "~/server/db/schema";
import { today } from "~/types";

export async function getBookingById(bookingId: number) {
  return db.select().from(bookings).where(eq(bookings.id, bookingId));
}

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
