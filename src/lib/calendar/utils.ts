import {
  differenceInCalendarDays,
  isPast,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  isBefore,
} from "date-fns";
import { cn } from "~/lib/utils";
import { Booking } from "~/types";

export function bookingTypeEnumToString(bookingTypeValue: string): string {
  if (bookingTypeValue === "Private") {
    return "Privat";
  } else if (bookingTypeValue === "Public") {
    return "Åpen";
  } else if (bookingTypeValue === "AirBnB") {
    return "AirBnB";
  }
  return "Udefinert reservasjonstype";
}

function isDisabled(day: Date, viewMonth: Date): boolean {
  return !isSameMonth(day, viewMonth) || isPast(day.setHours(23, 59, 59, 999));
}

function isSelected(
  day: Date,
  selectedDateFirst: Date,
  selectedDateLast: Date,
): boolean {
  return (
    isWithinInterval(day.setHours(0, 0, 0, 0), {
      start: selectedDateFirst.setHours(0, 0, 0, 0),
      end: selectedDateLast.setHours(0, 0, 0, 0),
    }) && differenceInCalendarDays(selectedDateLast, selectedDateFirst) < 60
  );
}

function getSelectedStyle(
  day: Date,
  selectedDateFirst: Date | string,
  selectedDateLast: Date | string,
  booking?: Booking,
  userId?: string | null,
): string {
  let className = "";
  if (isSameDay(selectedDateFirst, selectedDateLast)) {
    className = "rounded-md md:rounded-xl";
  } else if (isSameDay(day, selectedDateFirst)) {
    if (differenceInCalendarDays(selectedDateLast, selectedDateFirst) > 6) {
      className = "rounded-tl-md md:rounded-tl-xl";
    } else {
      className = "rounded-l-md md:rounded-l-xl";
    }
  } else if (isSameDay(day, selectedDateLast)) {
    if (differenceInCalendarDays(selectedDateLast, selectedDateFirst) > 6) {
      className = "rounded-br-md md:rounded-br-xl";
    } else {
      className = "rounded-r-md md:rounded-r-xl";
    }
  }
  if (booking) {
    if (booking.bookingType == "AirBnB") {
      className += " bg-airbnb-base";
    } else if (userId && booking.byId == userId) {
      className += " bg-tertiary-container";
    } else {
      className += " bg-secondary-container";
    }
  }
  return className;
}

export function getDayBooking(
  day: Date,
  bookings: Booking[],
): Booking | undefined {
  let returnBooking: Booking | undefined = undefined;
  bookings.forEach((booking) => {
    if (isBefore(booking.fromDate, day) && isBefore(day, booking.toDate)) {
      returnBooking = booking;
    } else if (
      isSameDay(booking.toDate, day) ||
      isSameDay(booking.fromDate, day)
    ) {
      returnBooking = booking;
    }
  });
  return returnBooking;
}

export function getCellStyles(
  cellDay: Date,
  selectedDates: Date[],
  viewMonth: Date,
  booking?: Booking,
  userId?: string | null,
): string {
  if (booking) {
    return cn(
      "pointer-events-none",
      getSelectedStyle(
        cellDay,
        booking.fromDate,
        booking.toDate,
        booking,
        userId,
      ),
      "",
    );
  } else if (isSelected(cellDay, selectedDates[0]!, selectedDates[1]!)) {
    return cn(
      "cursor-pointer bg-primary-container",
      getSelectedStyle(cellDay, selectedDates[0]!, selectedDates[1]!),
    );
  } else if (
    !isSameMonth(cellDay, viewMonth) &&
    !isPast(cellDay.setHours(23, 59, 59, 999))
  ) {
    return "cursor-pointer text-surface-on_variant rounded-sm md:rounded-md bg-surface-container hover:bg-surface-container m-0.5 md:m-1";
  } else if (isPast(cellDay.setHours(23, 59, 59, 999))) {
    return "text-surface-container_highest rounded-sm md:rounded-md bg-surface-container_low pointer-events-none m-0.5 md:m-1";
  } else {
    return "cursor-pointer bg-surface-container_highest rounded-sm md:rounded-md hover:bg-surface-container_high m-0.5 md:m-1";
  }
}

export function getSelectedSpanStyles(
  cellDay: Date,
  selectedDates: Date[],
  booking?: Booking,
  userId?: string | null,
): string {
  if (booking) {
    let className = "h-2 w-full absolute top-0 left-0";
    if (booking.bookingType === "AirBnB") {
      return className + " bg-airbnb-container";
    } else if (userId && booking.byId === userId) {
      return className + " bg-tertiary-base";
    }
    return className + " bg-secondary-base";
  } else if (isSelected(cellDay, selectedDates[0]!, selectedDates[1]!)) {
    return "bg-primary-base h-2 w-full absolute top-0 left-0";
  }
  return "hidden";
}
