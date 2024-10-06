import "server-only";
import { and, asc, eq, gte } from "drizzle-orm";
import { cache } from "react";
import { db } from "~/server/db";
import { bookings, cabins } from "~/server/db/schema";
import { Booking, Cabin, today } from "~/types";

export const getBookingById = cache(
  async (bookingId: number): Promise<Booking | undefined> => {
    return db.query.bookings.findFirst({
      where: eq(bookings.id, bookingId),
    });
  },
);

export const getBookings = cache(
  async (cabinId: number): Promise<Booking[]> => {
    return db.query.bookings.findMany({
      where: eq(bookings.cabinId, cabinId),
      orderBy: asc(bookings.fromDate),
    });
  },
);

export const getFutureBookings = cache(
  async (cabinId: number): Promise<Booking[]> => {
    return db.query.bookings.findMany({
      where: and(
        eq(bookings.cabinId, cabinId),
        gte(bookings.toDate, today.toISOString()),
      ),
      orderBy: asc(bookings.fromDate),
    });
  },
);

export const getCabinById = cache(
  async (cabinId: number): Promise<Cabin | undefined> => {
    return db.query.cabins.findFirst({
      where: eq(cabins.id, cabinId),
    });
  },
);

export const getPublicOrPrivateCabins = cache(
  async (isPublic = false): Promise<Cabin[]> => {
    return db.query.cabins.findMany({
      where: eq(cabins.isPubliclyViewable, isPublic),
      orderBy: asc(cabins.id),
    });
  },
);
