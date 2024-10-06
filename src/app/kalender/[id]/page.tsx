import { currentUser } from "@clerk/nextjs/server";
import { CabinNotFound } from "~/components/cabin/cabin-not-found";
import CalendarWFormModal from "~/components/calendar/calendar-w-form-modal";
import { FutureBookingsList } from "~/components/calendar/future-bookings-list";
import { hasCabinAccess } from "~/lib/calendar/utils";
import { Booking, Cabin, CABIN_READ_ACCESS } from "~/types";
import { getBookings, getCabinById } from "~/server/queries";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { id: number } }) {
  const bookings: Booking[] = await getBookings(params.id);
  const cabin: Cabin | undefined = await getCabinById(params.id);
  const user = await currentUser();

  if (!cabin) {
    return <CabinNotFound cabinId={params.id} />;
  }
  if (!cabin.isPubliclyViewable) {
    if (!user) {
      return <CabinNotFound cabinId={params.id} />;
    }

    if (!hasCabinAccess(CABIN_READ_ACCESS, user, cabin.id)) {
      return <CabinNotFound cabinId={params.id} />;
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-4 px-1 py-4 sm:px-4 md:px-8">
      <h1 className="text-4xl font-bold uppercase text-primary-container_on">
        {cabin.name}
      </h1>
      <CalendarWFormModal
        bookings={bookings}
        cabin={cabin}
        userId={user ? user.id : undefined}
      />
      <FutureBookingsList bookings={bookings} />
    </div>
  );
}
