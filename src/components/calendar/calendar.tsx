import { useAuth } from "@clerk/nextjs";
import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  getWeek,
  isAfter,
  isBefore,
  setDefaultOptions,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from "date-fns";
import { nb } from "date-fns/locale";

import React, { useState } from "react";

import {
  getCellStyles,
  getBookingForDay,
  getSelectedSpanStyles,
  selectionContainsBooking,
} from "~/lib/calendar/utils";
import { cn } from "~/lib/utils";
import {
  Booking,
  formatDayLong,
  formatDayNum,
  formatDayShort,
  formatMonthYear,
  undefinedDate,
} from "~/types";

interface CalendarProps {
  setOrderedSelectedDates: React.Dispatch<React.SetStateAction<Date[]>>;
  orderedSelectedDates: Date[];
  bookings: Booking[];
}

export function Calendar({
  setOrderedSelectedDates,
  orderedSelectedDates,
  bookings,
}: CalendarProps) {
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [previousSelectedDate, setPreviousSelectedDate] =
    useState<Date>(undefinedDate);
  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);

  setDefaultOptions({ locale: nb });

  const user = useAuth();

  const onDateClick = (day: Date, dayBooking: Booking | undefined) => {
    if (previousSelectedDate === undefinedDate && !dayBooking) {
      setPreviousSelectedDate(day);
      setOrderedSelectedDates([day, day]);
      if (isBefore(day, monthStart)) {
        prevMonth();
      } else if (isAfter(day, monthEnd)) {
        nextMonth();
      }
      return;
    }

    const [isBooked, firstBooking, lastBooking] = selectionContainsBooking(
      day,
      previousSelectedDate,
      bookings,
    );

    if (isBefore(day, previousSelectedDate)) {
      if (isBooked) {
        setOrderedSelectedDates([day, subDays(firstBooking!.fromDate, 1)]);
      } else {
        setOrderedSelectedDates([day, previousSelectedDate]);
      }
    } else {
      if (isBooked) {
        setOrderedSelectedDates([addDays(lastBooking!.toDate, 1), day]);
      } else {
        setOrderedSelectedDates([previousSelectedDate, day]);
      }
    }
    setPreviousSelectedDate(day);
    if (isBefore(day, monthStart)) {
      prevMonth();
    } else if (isAfter(day, monthEnd)) {
      nextMonth();
    }
  };

  const nextMonth = () => {
    setViewDate(addMonths(viewDate, 1));
  };

  const prevMonth = () => {
    setViewDate(subMonths(viewDate, 1));
  };

  const renderMonthHeader = () => {
    return (
      <div className="flex items-center justify-between rounded-t bg-primary-container py-2 text-center text-2xl font-bold uppercase text-primary-container_on md:text-3xl">
        <div
          className="duration-250 mx-5 min-w-max cursor-pointer transition-transform ease-out hover:scale-150"
          onClick={prevMonth}
        >
          {"<"}-
        </div>
        <span>{format(viewDate, formatMonthYear)}</span>
        <div
          className="duration-250 mx-5 min-w-max cursor-pointer transition-transform ease-out hover:scale-150"
          onClick={nextMonth}
        >
          -{">"}
        </div>
      </div>
    );
  };

  const renderWeekdays = () => {
    const days = [];

    const startDate = startOfWeek(viewDate);

    days.push(
      <div className="text-center text-sm sm:text-base" key="week-label">
        #
      </div>,
    );

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center text-sm sm:text-base" key={i}>
          <span className="block md:hidden">
            {format(addDays(startDate, i), formatDayShort)}
          </span>
          <span className="hidden md:block">
            {format(addDays(startDate, i), formatDayLong)}
          </span>
        </div>,
      );
    }

    return (
      <div className="grid grid-cols-[.75em_1fr_1fr_1fr_1fr_1fr_1fr_1fr] pt-1 uppercase md:grid-cols-[1.5em_1fr_1fr_1fr_1fr_1fr_1fr_1fr]">
        {days}
      </div>
    );
  };

  const renderDayCells = () => {
    const days = [];

    let day = startOfWeek(monthStart);
    let formattedDate = "";
    let weekNumber = 0;

    while (day <= monthEnd) {
      weekNumber = getWeek(day);
      days.push(
        <div
          className="justify-self-center text-center text-xs font-bold [line-height:0.5rem] [text-orientation:upright] [writing-mode:vertical-lr] md:pt-4 md:text-base md:[line-height:normal] md:[writing-mode:horizontal-tb]"
          key={weekNumber}
        >
          {weekNumber}
        </div>,
      );
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, formatDayNum);
        const cloneDay = day;
        const dayBooking = getBookingForDay(day, bookings);
        days.push(
          <div
            className={cn(
              "group/cell relative flow-root overflow-hidden pt-1 text-center duration-75 ease-in-out md:text-right",
              getCellStyles(
                day,
                orderedSelectedDates,
                viewDate,
                dayBooking,
                user.userId,
              ),
            )}
            key={day.toString()}
            onClick={() => onDateClick(cloneDay, dayBooking)}
          >
            <span
              className={getSelectedSpanStyles(
                day,
                orderedSelectedDates,
                dayBooking,
                user.userId,
              )}
            >
              {" "}
            </span>
            <span className="select-none font-bold md:m-4">
              {formattedDate}
            </span>
            <span className="absolute left-[-0.15em] top-[-.4em] hidden select-none text-[9.5em] font-extrabold opacity-0 md:block md:group-hover/cell:opacity-5">
              {formattedDate}
            </span>
          </div>,
        );
        day = addDays(day, 1);
      }
    }
    return (
      <div className="grid auto-rows-[4rem] grid-cols-[.75em_1fr_1fr_1fr_1fr_1fr_1fr_1fr] justify-items-stretch pt-1 uppercase md:auto-rows-[6rem] md:grid-cols-[1.5em_1fr_1fr_1fr_1fr_1fr_1fr_1fr]">
        {days}
      </div>
    );
  };

  return (
    <div className="w-full max-w-screen-lg rounded-b bg-surface-container_lowest object-center">
      {renderMonthHeader()}
      {renderWeekdays()}
      {renderDayCells()}
    </div>
  );
}
