"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { addDays } from "date-fns";
import { eq, sql } from "drizzle-orm";
import {
  AUTHENTICATION_ERROR,
  NOT_FOUND,
  PERMISSION_ERROR,
  SUCCESS,
} from "~/errors";
import { db } from "~/server/db";
import { bookings } from "~/server/db/schema";
import { getBookingById } from "~/server/queries";

export async function createBooking(
  bookingType: "Private" | "Public" | "AirBnB",
  fromDate: Date,
  toDate: Date,
  description?: string,
) {
  const user = auth();
  if (!user.userId) return AUTHENTICATION_ERROR;

  const fullUserData = await clerkClient.users.getUser(user.userId);

  if (fullUserData?.privateMetadata?.["can-book"] !== true)
    return PERMISSION_ERROR;

  await db.insert(bookings).values({
    byId: user.userId,
    byName: fullUserData.fullName,
    bookingType: bookingType,
    fromDate: addDays(fromDate, 1).toDateString(), // Fixes offset due to timezones on server
    toDate: addDays(toDate, 1).toDateString(), // Fixes offset due to timezones on server
    description: description,
  });
  return SUCCESS;
}

export async function editBooking(
  bookingType: "Private" | "Public" | "AirBnB",
  fromDate: Date,
  toDate: Date,
  bookingId?: number,
  description?: string,
) {
  const user = auth();
  if (!user.userId) return AUTHENTICATION_ERROR;

  if (!bookingId) return NOT_FOUND;
  const booking = await getBookingById(bookingId);
  if (!booking) return NOT_FOUND;
  if (booking[0]!.byId !== user.userId) return PERMISSION_ERROR;

  await db
    .update(bookings)
    .set({
      updatedAt: sql`NOW()`,
      bookingType: bookingType,
      fromDate: fromDate.toDateString(),
      toDate: toDate.toDateString(),
      description: description,
    })
    .where(eq(bookings.id, bookingId));
  return SUCCESS;
}

export async function deleteBooking(bookingId: number) {
  const user = auth();
  if (!user.userId) return AUTHENTICATION_ERROR;

  const booking = await getBookingById(bookingId);
  if (!booking) return NOT_FOUND;
  if (booking[0]!.byId !== user.userId) return PERMISSION_ERROR;

  await db.delete(bookings).where(eq(bookings.id, bookingId));
  return SUCCESS;
}
