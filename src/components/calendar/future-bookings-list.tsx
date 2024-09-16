import { auth } from "@clerk/nextjs/server";
import { format, setDefaultOptions } from "date-fns";
import { nb } from "date-fns/locale";
import React from "react";
import { BookingEditDelete } from "~/components/calendar/booking-edit-delete";
import { Separator } from "~/components/ui/separator";
import { bookingTypeEnumToString } from "~/lib/calendar/utils";
import { Booking, formatDisplayBooking, today } from "~/types";

interface FutureBookingsListProps {
  bookings: Booking[];
}

export async function FutureBookingsList({
  bookings,
}: FutureBookingsListProps) {
  setDefaultOptions({ locale: nb });
  const futureBookings = bookings.filter((booking) => {
    return new Date(booking.toDate).getTime() >= today.getTime();
  });
  const { userId } = auth();

  return (
    <div className="mx-auto mt-8 w-full max-w-screen-lg rounded-md bg-surface-container p-6">
      <h2 className="pb-4 text-center text-3xl text-primary-base">
        Kommende reservasjoner
      </h2>
      <div className="flex flex-col gap-4">
        {futureBookings.map((booking) => (
          <div
            key={booking.id}
            className="flex min-h-12 flex-wrap gap-2 rounded-md bg-surface-container_high p-2"
          >
            <div className="self-center">
              {bookingTypeEnumToString(booking.bookingType)}
            </div>
            <Separator orientation="vertical" className="bg-surface-on" />
            <div className="self-center">
              {format(booking.fromDate, formatDisplayBooking)} -{" "}
              {format(booking.toDate, formatDisplayBooking)}
            </div>
            {booking.byId == userId && <BookingEditDelete booking={booking} />}
            <Separator className="bg-surface-on" />
            <div className="self-center">{booking.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
