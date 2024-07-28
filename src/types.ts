import { pgEnum } from "drizzle-orm/pg-core";
import { z } from "zod";

// Dates
export const undefinedDate = new Date(0);

export const today = new Date();
today.setHours(0, 0, 0, 0);

export const formatDateString = "PPP";
export const formatMonthYear = "MMMM yyyy";
export const formatDayLong = "EEEE";
export const formatDayShort = "eee";
export const formatDayNum = "d";

// Drizzle

export const bookingTypeEnum = pgEnum("booking_type", [
  "Private",
  "Public",
  "AirBnB",
]);

// Zod

export const createBookingFormSchema = z.object({
  bookingType: z.enum(bookingTypeEnum.enumValues, {
    required_error: "En reservasjonstype er nødvendig",
  }),
  fromDate: z
    .date({
      required_error: "En fra dato er nødvendig.",
    })
    .min(today, {
      message: "En reservasjon må være i fremtiden",
    }),
  toDate: z.date({
    required_error: "En til dato er nødvendig",
  }),
  description: z
    .string()
    .max(256, {
      message: "Beskrivelsen kan ikke være lengre enn 256 karakterer.",
    })
    .optional(),
});
