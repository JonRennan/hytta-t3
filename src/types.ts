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
export const formatDisplayBooking = "do MMM";
export const formatDbDate = "yyyy-MM-dd";

// Drizzle

export const bookingTypeEnum = pgEnum("booking_type", [
  "Private",
  "Public",
  "AirBnB",
]);

// Zod

export const bookingFormSchema = z
  .object({
    bookingType: z.enum(bookingTypeEnum.enumValues, {
      required_error: "En reservasjonstype er nødvendig",
    }),
    fromDate: z
      .date({
        required_error: "Velg en fra-dato.",
      })
      .min(today, {
        message: "En reservasjon kan ikke være i fortiden",
      }),
    toDate: z.date({
      required_error: "Velg en til-dato.",
    }),
    description: z
      .string()
      .max(256, {
        message: "Beskrivelsen kan ikke være lengre enn 256 karakterer.",
      })
      .optional(),
  })
  .refine((data) => data.fromDate <= data.toDate, {
    path: ["toDate"],
    message: "Til-datoen må være lik eller etter fra-datoen.",
  });

// Types

export class Booking {
  id: number;
  cabinId: number | null;
  byId: string;
  byName: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  bookingType: "Private" | "Public" | "AirBnB";
  fromDate: string;
  toDate: string;
  description: string | null;

  constructor(
    id: number,
    cabinId: number | null,
    byId: string,
    byName: string | null,
    createdAt: Date | null,
    updatedAt: Date | null,
    bookingType: "Private" | "Public" | "AirBnB",
    fromDate: string,
    toDate: string,
    description: string | null,
  ) {
    this.id = id;
    this.cabinId = cabinId;
    this.byId = byId;
    this.byName = byName;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.bookingType = bookingType;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.description = description;
  }
}

export class Cabin {
  id: number;
  owner: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
  imageLink: string | null;
  description: string | null;
  address: string | null;
  gmapsLink: string | null;
  isPubliclyViewable: boolean;
  isPubliclyWriteable: boolean;

  constructor(
    id: number,
    owner: string,
    name: string | null,
    createdAt: Date,
    updatedAt: Date,
    imageLink: string | null,
    description: string | null,
    address: string | null,
    gmapsLink: string | null,
    isPubliclyViewable: boolean,
    isPubliclyWriteable: boolean,
  ) {
    this.id = id;
    this.owner = owner;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.imageLink = imageLink;
    this.description = description;
    this.address = address;
    this.gmapsLink = gmapsLink;
    this.isPubliclyViewable = isPubliclyViewable;
    this.isPubliclyWriteable = isPubliclyWriteable;
  }
}
