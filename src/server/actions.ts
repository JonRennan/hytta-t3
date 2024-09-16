"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
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
  fromDate: string,
  toDate: string,
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
    fromDate: fromDate,
    toDate: toDate,
    description: description,
  });
  return SUCCESS;
}

export async function editBooking(
  bookingType: "Private" | "Public" | "AirBnB",
  fromDate: string,
  toDate: string,
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
      fromDate: fromDate,
      toDate: toDate,
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
