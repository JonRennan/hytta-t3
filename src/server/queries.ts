import "server-only";
import { and, asc, eq, gte } from "drizzle-orm";
import { db } from "~/server/db";
import { bookings, cabins } from "~/server/db/schema";
import { Booking, Cabin, today } from "~/types";

export async function getBookingById(
  bookingId: number,
): Promise<Booking | undefined> {
  return db.query.bookings.findFirst({
    where: eq(bookings.id, bookingId),
  });
}

export async function getBookings(cabinId: number): Promise<Booking[]> {
  return db.query.bookings.findMany({
    where: eq(bookings.cabinId, cabinId),
    orderBy: asc(bookings.fromDate),
  });
}

export async function getFutureBookings(cabinId: number): Promise<Booking[]> {
  return db.query.bookings.findMany({
    where: and(
      eq(bookings.cabinId, cabinId),
      gte(bookings.toDate, today.toISOString()),
    ),
    orderBy: asc(bookings.fromDate),
  });
}

export async function getCabinById(
  cabinId: number,
): Promise<Cabin | undefined> {
  return db.query.cabins.findFirst({
    where: eq(cabins.id, cabinId),
  });
}

export async function getPublicOrPrivateCabins(
  isPublic = false,
): Promise<Cabin[]> {
  return db.query.cabins.findMany({
    where: eq(cabins.isPubliclyViewable, isPublic),
    orderBy: asc(cabins.id),
  });
}
