import CalendarWFormModal from "~/components/calendar/calendar-w-form-modal";
import { Separator } from "~/components/ui/separator";
import { bookingTypeEnumToString } from "~/lib/calendar/utils";
import { getBookings } from "~/server/queries";
import { Booking, today } from "~/types";

export const dynamic = "force-dynamic";

interface FutureBookingsListProps {
  bookings: Booking[];
}

async function FutureBookingsList({ bookings }: FutureBookingsListProps) {
  const futureBookings = bookings.filter((booking) => {
    return new Date(booking.toDate).getTime() >= today.getTime();
  });

  return (
    <div className="mx-auto mt-8 w-full max-w-screen-lg rounded-md bg-surface-container p-6">
      <h2 className="pb-4 text-center text-3xl text-primary-base">
        Kommende reservasjoner
      </h2>
      <div className="flex flex-col gap-4">
        {futureBookings.map((booking) => (
          <div
            key={booking.id}
            className="flex min-h-12 flex-wrap content-center gap-2 rounded-md bg-surface-container_high p-2"
          >
            <div>{bookingTypeEnumToString(booking.bookingType)}</div>
            <Separator
              orientation="vertical"
              className="h-5.5 w-[1px] bg-surface-on"
            />
            <div>
              {booking.fromDate} - {booking.toDate}
            </div>
            <Separator className="bg-surface-on" />
            <div>{booking.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function Home() {
  const bookings: Booking[] = await getBookings();
  return (
    <main className="flex w-full flex-col p-1 sm:p-4 md:px-8">
      <CalendarWFormModal />
      <FutureBookingsList bookings={bookings} />
    </main>
  );
}
