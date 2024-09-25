import "server-only";
import { asc, eq, gte } from "drizzle-orm";
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

export async function getBookings(): Promise<Booking[] | undefined> {
  return db.query.bookings.findMany({
    orderBy: asc(bookings.fromDate),
  });
}

export async function getFutureBookings(): Promise<Booking[] | undefined> {
  return db.query.bookings.findMany({
    where: gte(bookings.toDate, today.toISOString()),
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

export async function getCabins(): Promise<Cabin[] | undefined> {
  return db.query.cabins.findMany({
    orderBy: asc(cabins.id),
  });
}

export async function getPublicCabins(): Promise<Cabin[] | undefined> {
  return db.query.cabins.findMany({
    where: eq(cabins.isPubliclyViewable, true),
    orderBy: asc(cabins.id),
  });
}
