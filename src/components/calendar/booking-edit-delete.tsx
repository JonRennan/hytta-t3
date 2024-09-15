"use client";

import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Spinner } from "~/components/ui/spinner";
import {
  AUTHENTICATION_ERROR,
  NOT_FOUND,
  PERMISSION_ERROR,
  SUCCESS,
} from "~/errors";
import { deleteBooking } from "~/server/actions";

interface BookingEditDeleteProps {
  bookingId: number;
}

export function BookingEditDelete({ bookingId }: BookingEditDeleteProps) {
  const router = useRouter();

  async function onClickDeleteButton(bookingId: number) {
    toast(
      <div className="flex items-center gap-2 text-white">
        <Spinner /> <span className="text-lg">Sletter reservasjon...</span>
      </div>,
      {
        duration: 100000,
        id: "deleting-booking",
      },
    );

    try {
      let res = await deleteBooking(bookingId);
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
    <>
      <Separator orientation="vertical" className="bg-surface-on" />
      <Button
        variant="destructive"
        size="icon"
        onClick={() => onClickDeleteButton(bookingId)}
      >
        <Trash2Icon size={16} />
      </Button>
    </>
  );
}
