import { currentUser } from "@clerk/nextjs/server";
import { MapPinIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CabinNotFound } from "~/components/cabin/cabin-not-found";
import CalendarWFormModal from "~/components/calendar/calendar-w-form-modal";
import { FutureBookingsList } from "~/components/calendar/future-bookings-list";
import { Button } from "~/components/ui/button";
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
      <div className="flex w-full items-center justify-center gap-4">
        {cabin.imageLink && (
          <Image
            src={cabin.imageLink}
            width={175}
            height={100}
            alt={cabin.name ? cabin.name : "Hytta"}
            className="hidden rounded md:block"
          />
        )}
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold uppercase text-primary-container_on">
            {cabin.name}
          </h1>
          <p className="text-center">{cabin.description}</p>
          {cabin.gmapsLink ? (
            <Button variant="link" asChild>
              <Link
                href={cabin.gmapsLink}
                target="_blank"
                className="flex gap-1"
              >
                {cabin.address} <MapPinIcon className="mt-[-.25em]" />
              </Link>
            </Button>
          ) : (
            <p>{cabin.address}</p>
          )}
        </div>
      </div>
      <CalendarWFormModal
        bookings={bookings}
        cabin={cabin}
        userId={user ? user.id : undefined}
      />
      <FutureBookingsList bookings={bookings} />
    </div>
  );
}
