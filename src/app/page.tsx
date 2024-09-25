import CalendarWFormModal from "~/components/calendar/calendar-w-form-modal";
import { FutureBookingsList } from "~/components/calendar/future-bookings-list";
import { Booking } from "~/types";
import { getBookings } from "~/server/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const bookings: Booking[] = await getBookings(1);
  return (
    <main className="flex w-full flex-col p-1 sm:p-4 md:px-8">
      <CalendarWFormModal bookings={bookings} />
      <FutureBookingsList bookings={bookings} />
    </main>
  );
}
