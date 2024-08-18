"use server";

import { addDays } from "date-fns";
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
    fromDate: addDays(fromDate, 1), // Fixes offset due to timezones on server
    toDate: addDays(toDate, 1), // Fixes offset due to timezones on server
    description: description,
  });
}
