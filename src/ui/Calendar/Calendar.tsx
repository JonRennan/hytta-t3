"use client";
import React from "react";
import { useState } from "react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  getWeek,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  setDefaultOptions,
} from "date-fns";
import { nb } from "date-fns/locale";
import { getCellStyles } from "~/lib/Calendar/utils";

const undefinedDate = new Date(0);

export function Calendar() {
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [selectedDateNew, setSelectedDateNew] = useState<Date>(undefinedDate);
  const [selectedDateOld, setSelectedDateOld] = useState<Date>(undefinedDate);

  const renderHeader = () => {
    setDefaultOptions({ locale: nb });

    const dateFormat = "MMMM yyyy";

    return (
      <div className="flex justify-between bg-primary-container py-2 text-center text-xl font-bold uppercase text-primary-container_on md:text-3xl">
        <div
          className="duration-250 mx-5 min-w-max cursor-pointer transition-transform ease-out hover:scale-150"
          onClick={prevMonth}
        >
          {"<"}-
        </div>
        <span>{format(viewDate, dateFormat)}</span>
        <div
          className="duration-250 mx-5 min-w-max cursor-pointer transition-transform ease-out hover:scale-150"
          onClick={nextMonth}
        >
          -{">"}
        </div>
      </div>
    );
  };

  const renderWeek = () => {
    const dateFormat = "EEEE";
    const dateFormatShort = "eee";
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
            {format(addDays(startDate, i), dateFormatShort)}
          </span>
          <span className="hidden md:block">
            {format(addDays(startDate, i), dateFormat)}
          </span>
        </div>,
      );
    }

    return (
      <div className="grid grid-cols-[.5em_1fr_1fr_1fr_1fr_1fr_1fr_1fr] pt-1 uppercase md:grid-cols-[1.5em_1fr_1fr_1fr_1fr_1fr_1fr_1fr]">
        {days}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(monthStart);
    const firstDate = startOfWeek(monthStart);
    const lastDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const days = [];

    let day = firstDate;
    let formattedDate = "";
    let weekNumber = 0;

    while (day <= lastDate) {
      weekNumber = getWeek(day);
      days.push(
        <div
          className="pt-4 text-left text-xs [line-height:0.5rem] [text-orientation:upright] [writing-mode:vertical-lr] md:text-center md:text-base md:[line-height:normal] md:[writing-mode:horizontal-tb]"
          key={weekNumber}
        >
          {weekNumber}
        </div>,
      );
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`relative flow-root overflow-hidden pt-1 text-center duration-75 ease-in-out md:text-right ${getCellStyles(day, selectedDateNew, selectedDateOld, viewDate)} group/cell`}
            key={day.toString()}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className="select-none font-bold md:m-4">
              {formattedDate}
            </span>
            <span className="absolute left-[-0.15em] top-[-.4em] hidden select-none text-[9.5em] font-extrabold opacity-0 md:block  md:group-hover/cell:opacity-5">
              {formattedDate}
            </span>
          </div>,
        );
        day = addDays(day, 1);
      }
    }
    return (
      <div className="grid auto-rows-[4rem] grid-cols-[.75em_1fr_1fr_1fr_1fr_1fr_1fr_1fr] justify-items-stretch bg-surface-container_lowest py-1 uppercase md:auto-rows-[6rem] md:grid-cols-[1.5em_1fr_1fr_1fr_1fr_1fr_1fr_1fr]">
        {days}
      </div>
    );
  };

  const onDateClick = (day: Date) => {
    if (selectedDateNew === undefinedDate) {
      setSelectedDateNew(day);
      setSelectedDateOld(day);
    } else {
      setSelectedDateOld(selectedDateNew);
      setSelectedDateNew(day);
    }
  };

  const nextMonth = () => {
    setViewDate(addMonths(viewDate, 1));
  };

  const prevMonth = () => {
    setViewDate(subMonths(viewDate, 1));
  };

  return (
    <div className="w-full max-w-screen-lg bg-surface-container_lowest object-center">
      {renderHeader()}
      {renderWeek()}
      {renderCells()}
    </div>
  );
}
