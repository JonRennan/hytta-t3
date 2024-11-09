import { pgEnum } from "drizzle-orm/pg-core";

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

// Clerk
export const CABIN_READ_ACCESS = "cabin-read-access";
export const CABIN_WRITE_ACCESS = "cabin-write-access";

// Drizzle

export const bookingTypeEnum = pgEnum("booking_type", [
  "Private",
  "Public",
  "AirBnB",
]);

// Types

export class Booking {
  id: number;
  cabinId: number | null;
  userId: string;
  userName: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  bookingType: "Private" | "Public" | "AirBnB";
  fromDate: string;
  toDate: string;
  description: string | null;

  constructor(
    id: number,
    cabinId: number | null,
    userId: string,
    userName: string | null,
    createdAt: Date | null,
    updatedAt: Date | null,
    bookingType: "Private" | "Public" | "AirBnB",
    fromDate: string,
    toDate: string,
    description: string | null,
  ) {
    this.id = id;
    this.cabinId = cabinId;
    this.userId = userId;
    this.userName = userName;
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
  ownerId: string;
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
    ownerId: string,
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
    this.ownerId = ownerId;
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
