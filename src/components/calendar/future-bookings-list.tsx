import {auth} from "@clerk/nextjs/server";
import {format, getWeek, setDefaultOptions} from "date-fns";
import {nb} from "date-fns/locale";
import React from "react";
import {BookingEditDelete} from "~/components/calendar/booking-edit-delete";
import {Separator} from "~/components/ui/separator";
import {bookingTypeEnumToString, filterPastBookings,} from "~/lib/calendar/utils";
import {cn} from "~/lib/utils";
import {type Booking, formatDisplayBooking} from "~/types";

interface FutureBookingsListProps {
    bookings: Booking[];
}

export async function FutureBookingsList({
                                             bookings,
                                         }: FutureBookingsListProps) {
    setDefaultOptions({locale: nb});
    const futureBookings = filterPastBookings(bookings);
    const {userId} = await auth();

    return (
        <div
            className="bg-surface-container_lowest mx-auto mt-2 w-full max-w-(--breakpoint-lg) rounded-md px-1 py-4 sm:p-4 md:px-6">
            <h2 className="text-primary-base px-2 pb-4 text-center text-3xl">
                Kommende reservasjoner
            </h2>
            <div className="flex flex-col gap-y-4">
                {futureBookings.map((booking) => (
                    <div
                        key={booking.id}
                        className={cn(
                            "grid min-h-12 w-full grid-cols-[1fr_3em] grid-rows-1 gap-1 rounded-md p-2",
                            booking.userId == userId
                                ? "bg-surface-container_highest grid-cols-[1fr_3em]"
                                : "bg-surface-container grid-cols-[1fr]",
                        )}
                    >
                        <div className="flex flex-col justify-start gap-2">
                            <div className="grid w-full grid-cols-[4em_1em_4em_1em_1fr] gap-y-1">
                                <div
                                    className={cn(
                                        "col-span-1 row-start-1 row-end-1",
                                        booking.bookingType == "AirBnB"
                                            ? "text-airbnb-container dark:text-airbnb"
                                            : "",
                                    )}
                                >
                                    {bookingTypeEnumToString(booking.bookingType)}
                                </div>
                                <Separator
                                    orientation="vertical"
                                    className={cn(
                                        "col-span-1 row-start-1 row-end-1",
                                        booking.bookingType == "AirBnB"
                                            ? "bg-airbnb-container dark:bg-airbnb"
                                            : "bg-surface-on",
                                    )}
                                />
                                <div
                                    className={cn(
                                        "col-span-1 row-start-1 row-end-1",
                                        booking.bookingType == "AirBnB"
                                            ? "text-airbnb-container dark:text-airbnb"
                                            : "",
                                    )}
                                >
                                    Uke {getWeek(booking.fromDate)}
                                </div>
                                <Separator
                                    orientation="vertical"
                                    className={cn(
                                        "col-span-1 row-start-1 row-end-1",
                                        booking.bookingType == "AirBnB"
                                            ? "bg-airbnb-container dark:bg-airbnb"
                                            : "bg-surface-on",
                                    )}
                                />
                                <div
                                    className={cn(
                                        "col-span-1 row-start-1 row-end-1",
                                        booking.bookingType == "AirBnB"
                                            ? "text-airbnb-container dark:text-airbnb"
                                            : "",
                                    )}
                                >
                                    {format(booking.fromDate, formatDisplayBooking)} -{" "}
                                    {format(booking.toDate, formatDisplayBooking)}
                                </div>
                                <Separator
                                    className={cn(
                                        "col-span-5 row-start-2 row-end-2 min-w-full",
                                        booking.bookingType == "AirBnB"
                                            ? "bg-airbnb-container dark:bg-airbnb"
                                            : "bg-surface-on",
                                    )}
                                />
                                {booking.bookingType != "AirBnB" && (
                                    <p className="col-span-5 row-start-3 row-end-3 text-sm italic">
                                        {booking.userName}
                                    </p>
                                )}
                            </div>
                            <p>{booking.description}</p>
                        </div>
                        {booking.userId == userId && (
                            <BookingEditDelete booking={booking} bookings={bookings}/>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
