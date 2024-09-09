"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
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
import { Booking, undefinedDate } from "~/types";

interface CalendarWFormModalProps {
  bookings: Booking[];
}

export default function CalendarWFormModal({
  bookings,
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
        <SignedOut>
          <SignInButton mode={"modal"}>
            <Button variant={"outline"}>Reserver hytta</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant={"outline"}>Reserver hytta</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Reserver hytta</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Kalenderen er ment som en oversikt over når vi vurderer/har
                planlagt turer, ikke for å erstatte kommunikasjon.
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
                />
              </div>
            </DialogContent>
          </Dialog>
        </SignedIn>
      </div>
    </div>
  );
}
