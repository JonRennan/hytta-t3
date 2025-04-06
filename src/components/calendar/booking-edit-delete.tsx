"use client";

import {PencilIcon, Trash2Icon} from "lucide-react";
import {useRouter} from "next/navigation";
import React, {useState} from "react";
import {toast} from "sonner";
import {BookingForm} from "~/components/calendar/booking-form";
import {Button} from "~/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "~/components/ui/dialog";
import {Separator} from "~/components/ui/separator";
import {Spinner} from "~/components/ui/spinner";
import {AUTHENTICATION_ERROR, NOT_FOUND, PERMISSION_ERROR, SUCCESS,} from "~/errors";
import {cn} from "~/lib/utils";
import {deleteBooking} from "~/server/actions";
import {type Booking} from "~/types";

interface BookingEditDeleteProps {
    booking: Booking;
    bookings: Booking[];
}

export function BookingEditDelete({
                                      booking,
                                      bookings,
                                  }: BookingEditDeleteProps) {
    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);

    async function onClickDeleteButton() {
        toast(
            <div className="text-surface-on flex items-center gap-2">
                <Spinner/> <span className="text-lg">Sletter reservasjon...</span>
            </div>,
            {
                duration: 100000,
                id: "deleting-booking",
            },
        );

        try {
            const res = await deleteBooking(booking.id);
            toast.dismiss("deleting-booking");
            if (res === SUCCESS) {
                toast.success("Reservasjonen ble slettet!");
            } else if (res === AUTHENTICATION_ERROR) {
                toast.error("Du må være pålogget for å slette en reservasjon.");
            } else if (res === PERMISSION_ERROR) {
                toast.error("Du kan bare slette dine egne reservasjoner.");
            } else if (res === NOT_FOUND) {
                toast.error("Fant ikke reservasjonen du prøvde å slette.");
            } else {
                toast.error("Noe gikk galt ved slettingen av reservasjonen.");
            }
            router.refresh();
        } catch (e) {
            toast.dismiss("deleting-booking");
            toast.error("Noe gikk galt ved slettingen av reservasjonen.");
        }
    }

    return (
        <div className="flex gap-2">
            <Separator
                orientation="vertical"
                className={cn(
                    "bg-surface-on",
                    booking.bookingType == "AirBnB"
                        ? "bg-airbnb-container dark:bg-airbnb"
                        : "bg-surface-on",
                )}
            />
            <div className="flex flex-col gap-4">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button size="icon">
                            <PencilIcon/>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Endre reservasjon</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <BookingForm
                                selectedDateFrom={new Date(booking.fromDate)}
                                selectedDateTo={new Date(booking.toDate)}
                                bookingId={booking.id}
                                prevBookingType={booking.bookingType}
                                prevDescription={booking.description ?? ""}
                                inDialog={true}
                                setOpen={setOpen}
                                bookings={bookings}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
                <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onClickDeleteButton()}
                >
                    <Trash2Icon/>
                </Button>
            </div>
        </div>
    );
}
