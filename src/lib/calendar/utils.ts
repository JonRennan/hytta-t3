import {
  differenceInCalendarDays,
  isBefore,
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
  selectedDateNew: Date,
  selectedDateOld: Date,
): boolean {
  return (
    isWithinInterval(day.setHours(0, 0, 0, 0), {
      start: selectedDateNew.setHours(0, 0, 0, 0),
      end: selectedDateOld.setHours(0, 0, 0, 0),
    }) &&
    Math.abs(differenceInCalendarDays(selectedDateNew, selectedDateOld)) < 60
  );
}

function getSelectedStyle(
  day: Date,
  selectedDateNew: Date,
  selectedDateOld: Date,
): string {
  let className = "";

  const isNewFirst = isBefore(selectedDateNew, selectedDateOld);

  if (isSameDay(selectedDateNew, selectedDateOld)) {
    className = "rounded-md md:rounded-xl";
  } else if (
    Math.abs(differenceInCalendarDays(selectedDateNew, selectedDateOld)) > 6
  ) {
    if (isSameDay(day, selectedDateNew) || isSameDay(day, selectedDateOld)) {
      if (
        (isNewFirst && isSameDay(day, selectedDateNew)) ||
        (!isNewFirst && isSameDay(day, selectedDateOld))
      ) {
        className = "rounded-tl-md md:rounded-tl-xl";
      } else {
        className = "rounded-br-md md:rounded-br-xl";
      }
    }
  } else if (
    isSameDay(day, selectedDateNew) ||
    isSameDay(day, selectedDateOld)
  ) {
    if (
      (isNewFirst && isSameDay(day, selectedDateNew)) ||
      (!isNewFirst && isSameDay(day, selectedDateOld))
    ) {
      className = "rounded-l-md md:rounded-l-xl";
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
  selectedDateNew: Date,
  selectedDateOld: Date,
  viewMonth: Date,
): string {
  if (isBooked(cellDay)) {
    return cn(
      "pointer-events-none bg-airbnb",
      // getSelectedStyle(cellDay, exampleReservation[0]!, exampleReservation[1]!),
      "",
    );
  } else if (isSelected(cellDay, selectedDateNew, selectedDateOld)) {
    return cn(
      "cursor-pointer bg-surface-container_high",
      getSelectedStyle(cellDay, selectedDateNew, selectedDateOld),
    );
  } else if (isDisabled(cellDay, viewMonth)) {
    return "text-surface-container_highest rounded-sm md:rounded-md bg-surface-container_low pointer-events-none m-0.5 md:m-1";
  } else {
    return "cursor-pointer bg-surface-container rounded-sm md:rounded-md hover:bg-surface-container_high m-0.5 md:m-1";
  }
}
