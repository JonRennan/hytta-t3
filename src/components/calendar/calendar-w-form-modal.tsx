"use client";

import React, { useState } from "react";
import { BookingForm } from "~/components/calendar/booking-form";
import { Calendar } from "~/components/calendar/calendar";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Booking, Cabin, undefinedDate } from "~/types";

interface CalendarWFormModalProps {
  bookings: Booking[];
  cabin: Cabin;
  userId: string | undefined;
}

export default function CalendarWFormModal({
  bookings,
  cabin,
  userId,
}: CalendarWFormModalProps) {
  const [selectedDates, setSelectedDates] = useState<Date[]>([
    undefinedDate,
    undefinedDate,
  ]);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Calendar
        setOrderedSelectedDates={setSelectedDates}
        orderedSelectedDates={selectedDates}
        bookings={bookings}
      />
      <div>
        {userId || cabin.isPubliclyWriteable ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant={"outline"}>Reserver {cabin.name}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-center">
                  Reserver {cabin.name}
                </DialogTitle>
              </DialogHeader>
              <DialogDescription className="text-center">
                {cabin.description}
              </DialogDescription>
              <div className="grid gap-4 py-4">
                <BookingForm
                  selectedDateFrom={
                    selectedDates[0] == undefinedDate
                      ? undefined
                      : selectedDates[0]
                  }
                  selectedDateTo={
                    selectedDates[1] == undefinedDate
                      ? undefined
                      : selectedDates[1]
                  }
                  inDialog={true}
                  setOpen={setOpen}
                  cabinId={cabin.id}
                />
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
