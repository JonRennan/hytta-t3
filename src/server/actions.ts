"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { addDays } from "date-fns";
import { AUTHENTICATION_ERROR, PERMISSION_ERROR, SUCCESS } from "~/errors";
import { db } from "~/server/db";
import { bookings } from "~/server/db/schema";

export async function createBooking(
  bookingType: string,
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
    fromDate: addDays(fromDate, 1), // Fixes offset due to timezones on server
    toDate: addDays(toDate, 1), // Fixes offset due to timezones on server
    description: description,
  });
  return SUCCESS;
}
