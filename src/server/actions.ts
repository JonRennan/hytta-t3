"use server";

import { db } from "~/server/db";
import { bookings } from "~/server/db/schema";

export async function createBooking(
  userId: string,
  bookingType: string,
  fromDate: Date,
  toDate: Date,
  description?: string,
) {
  await db.insert(bookings).values({
    by: userId,
    type: bookingType,
    fromDate: fromDate,
    toDate: toDate,
    description: description,
  });
}
