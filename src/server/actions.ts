"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import {
  AUTHENTICATION_ERROR,
  NOT_FOUND,
  PERMISSION_ERROR,
  SUCCESS,
} from "~/errors";
import { hasCabinAccess } from "~/lib/calendar/utils";
import { db } from "~/server/db";
import { bookings } from "~/server/db/schema";
import {
  getBookingById,
  getCabinById,
  getPublicOrPrivateCabins,
} from "~/server/queries";
import { Cabin, CABIN_READ_ACCESS, CABIN_WRITE_ACCESS } from "~/types";

export async function createBooking(
  cabinId: number,
  bookingType: "Private" | "Public" | "AirBnB",
  fromDate: string,
  toDate: string,
  description?: string,
) {
  const cabin = await getCabinById(cabinId);

  if (!cabin) {
    return NOT_FOUND;
  }

  const user = await currentUser();
  if (!user) {
    if (cabin.isPubliclyWriteable) {
      await db.insert(bookings).values({
        cabinId: cabinId,
        byId: "Anonymous",
        byName: "Anonymous",
        bookingType: bookingType,
        fromDate: fromDate,
        toDate: toDate,
        description: description,
      });
      return SUCCESS;
    } else return AUTHENTICATION_ERROR;
  }

  if (
    !hasCabinAccess(CABIN_WRITE_ACCESS, user, cabinId) &&
    !cabin.isPubliclyWriteable
  ) {
    return PERMISSION_ERROR;
  }

  await db.insert(bookings).values({
    cabinId: cabinId,
    byId: user.id,
    byName: user.fullName,
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
  const { userId } = auth();
  if (!userId) return AUTHENTICATION_ERROR;

  if (!bookingId) return NOT_FOUND;
  const booking = await getBookingById(bookingId);
  if (!booking) return NOT_FOUND;
  if (booking.byId !== userId) return PERMISSION_ERROR;

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
  const { userId } = auth();
  if (!userId) return AUTHENTICATION_ERROR;

  const booking = await getBookingById(bookingId);
  if (!booking) return NOT_FOUND;
  if (booking.byId !== userId) return PERMISSION_ERROR;

  await db.delete(bookings).where(eq(bookings.id, bookingId));
  return SUCCESS;
}

export async function getMyCabins(): Promise<Cabin[]> {
  const user = await currentUser();
  const publicCabins = await getPublicOrPrivateCabins(true);
  if (!user) return publicCabins;

  const privateCabins = await getPublicOrPrivateCabins(false);

  let returnCabins = privateCabins.filter((cabin) =>
    hasCabinAccess(CABIN_READ_ACCESS, user, cabin.id),
  );

  return returnCabins.concat(publicCabins);
}
