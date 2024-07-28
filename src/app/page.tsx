import CalendarWFormModal from "~/components/calendar/calendar-w-form-modal";
import { getBookings } from "~/server/queries";

export const dynamic = "force-dynamic";

async function Bookings() {
  const bookings = await getBookings();
  return (
    <div className="mx-auto w-full max-w-screen-lg">
      {bookings.map((booking) => (
        <div key={booking.id}>
          {booking.type}: {booking.fromDate} - {booking.toDate} <br />
          {booking.description ? booking.description : <br />}
          <br />
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex w-full flex-col p-1 sm:p-4 md:px-8">
      <CalendarWFormModal />
      <Bookings />
    </main>
  );
}
