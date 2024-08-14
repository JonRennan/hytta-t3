import {
  differenceInCalendarDays,
  isPast,
  isSameDay,
  isSameMonth,
  isWithinInterval,
} from "date-fns";
import { cn } from "~/lib/utils";

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
  selectedDateFirst: Date,
  selectedDateLast: Date,
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
  return className;
}

function isBooked(day: Date): boolean {
  // TODO: compare day with bookings from db
  return false;
}

export function getCellStyles(
  cellDay: Date,
  selectedDates: Date[],
  viewMonth: Date,
): string {
  if (isBooked(cellDay)) {
    return cn(
      "pointer-events-none",
      // getSelectedStyle(cellDay, exampleReservation[0]!, exampleReservation[1]!),
      "",
    );
  } else if (isSelected(cellDay, selectedDates[0]!, selectedDates[1]!)) {
    return cn(
      "cursor-pointer bg-surface-container_high",
      getSelectedStyle(cellDay, selectedDates[0]!, selectedDates[1]!),
    );
  } else if (
    !isSameMonth(cellDay, viewMonth) &&
    !isPast(cellDay.setHours(23, 59, 59, 999))
  ) {
    return "cursor-pointer text-surface-container_highest rounded-sm md:rounded-md bg-surface-container_low hover:bg-surface-container m-0.5 md:m-1";
  } else if (isPast(cellDay.setHours(23, 59, 59, 999))) {
    return "text-surface-container_highest rounded-sm md:rounded-md bg-surface-container_low pointer-events-none m-0.5 md:m-1";
  } else {
    return "cursor-pointer bg-surface-container rounded-sm md:rounded-md hover:bg-surface-container_high m-0.5 md:m-1";
  }
}

export function getSelectedSpanStyles(
  cellDay: Date,
  selectedDates: Date[],
): string {
  if (isSelected(cellDay, selectedDates[0]!, selectedDates[1]!)) {
    return "bg-primary-base h-2 w-full absolute top-0 left-0";
  }
  return "hidden";
}
