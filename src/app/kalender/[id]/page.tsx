import CalendarWFormModal from "~/components/calendar/calendar-w-form-modal";
import { FutureBookingsList } from "~/components/calendar/future-bookings-list";
import { Booking, Cabin } from "~/types";
import { getBookings, getCabinById } from "~/server/queries";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { id: number } }) {
  const bookings: Booking[] = await getBookings(params.id);
  const cabin: Cabin | undefined = await getCabinById(params.id);

  if (!cabin) {
    return (
      <p className="text-surface-on_v mx-auto mt-8 w-fit rounded bg-surface-container_low p-4 text-center text-2xl">
        Fant ikke hytte {params.id}, eller så har du ikke tilgang til hytta.
      </p>
    );
  }

  return (
    <main className="flex w-full flex-col items-center gap-4 sm:p-4 md:px-8">
      <h1 className="text-4xl font-bold uppercase text-primary-container_on">
        {cabin.name}
      </h1>
      <CalendarWFormModal bookings={bookings} cabinId={cabin.id} />
      <FutureBookingsList bookings={bookings} />
    </main>
  );
}
