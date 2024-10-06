import { zodResolver } from "@hookform/resolvers/zod";

import { format, setDefaultOptions } from "date-fns";
import { nb } from "date-fns/locale";

import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { DialogFooter } from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ShadCalendar } from "~/components/ui/shad-calendar";
import { Spinner } from "~/components/ui/spinner";
import { Textarea } from "~/components/ui/textarea";
import {
  AUTHENTICATION_ERROR,
  NOT_FOUND,
  PERMISSION_ERROR,
  SUCCESS,
} from "~/errors";
import {
  getBookingIntervals,
  selectionContainsBooking,
} from "~/lib/calendar/utils";

import { cn } from "~/lib/utils";
import { createBooking, editBooking } from "~/server/actions";
import {
  Booking,
  bookingTypeEnum,
  formatDateString,
  formatDbDate,
  today,
} from "~/types";

interface BookingFormProps {
  selectedDateFrom?: Date;
  selectedDateTo?: Date;
  cabinId?: number;
  bookingId?: number;
  prevBookingType?: "Private" | "Public" | "AirBnB";
  prevDescription?: string;
  inDialog: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  bookings: Booking[];
}

export function BookingForm({
  selectedDateFrom,
  selectedDateTo,
  cabinId,
  bookingId,
  prevBookingType,
  prevDescription,
  inDialog = false,
  setOpen,
  bookings,
}: BookingFormProps) {
  setDefaultOptions({ locale: nb });
  const router = useRouter();

  const bookingIntervals = getBookingIntervals(bookings, bookingId);

  const bookingFormSchema = z
    .object({
      bookingType: z.enum(bookingTypeEnum.enumValues, {
        required_error: "En reservasjonstype er nødvendig",
      }),
      fromDate: z
        .date({
          required_error: "Velg en fra-dato.",
        })
        .min(today, {
          message: "En reservasjon kan ikke være i fortiden",
        }),
      toDate: z.date({
        required_error: "Velg en til-dato.",
      }),
      description: z
        .string()
        .max(256, {
          message: "Beskrivelsen kan ikke være lengre enn 256 karakterer.",
        })
        .optional(),
    })
    .refine((data) => data.fromDate <= data.toDate, {
      path: ["toDate"],
      message: "Til-datoen må være lik eller etter fra-datoen.",
    })
    .refine(
      (data) => {
        return !selectionContainsBooking(
          data.fromDate,
          data.toDate,
          bookings,
        )[0];
      },
      {
        path: ["toDate"],
        message: "Hytta er allerede reservert i perioden du har valgt.",
      },
    );

  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      bookingType: prevBookingType ? prevBookingType : "Private",
      fromDate: selectedDateFrom,
      toDate: selectedDateTo,
      description: prevDescription,
    },
  });

  async function submitCreateBooking(
    values: z.infer<typeof bookingFormSchema>,
  ) {
    toast(
      <div className="flex items-center gap-2 text-surface-on">
        <Spinner /> <span className="text-lg">Lager reservasjon...</span>
      </div>,
      {
        duration: 100000,
        id: "creating-booking",
      },
    );

    try {
      if (cabinId) {
        let res = await createBooking(
          cabinId,
          values.bookingType,
          format(values.fromDate, formatDbDate),
          format(values.toDate, formatDbDate),
          values.description,
        );
        toast.dismiss("creating-booking");
        if (res === SUCCESS) {
          toast.success("Reservasjonen ble laget!");
        } else if (res === AUTHENTICATION_ERROR) {
          toast.error("Du må være pålogget for å reservere denne hytta.");
        } else if (res === PERMISSION_ERROR) {
          toast.error(
            "Du mangler tillatelse til å reservere denne hytta. Kontakt Jon hvis du mener det er feil.",
          );
        } else if (res === NOT_FOUND) {
          toast.error("Fant ikke hytta du prøvde å reservere.");
        } else {
          toast.error("Noe gikk galt i opprettingen av reservasjonen.");
        }
      } else {
        toast.dismiss("creating-booking");
        toast.error("En reservasjon må være knyttet til en hytte.");
      }
      if (inDialog && setOpen) {
        setOpen(false);
      }
      router.refresh();
    } catch (e) {
      toast.dismiss("creating-booking");
      toast.error("Noe gikk galt i opprettingen av reservasjonen.");
    }
  }

  async function submitEditBooking(values: z.infer<typeof bookingFormSchema>) {
    toast(
      <div className="flex items-center gap-2 text-surface-on">
        <Spinner /> <span className="text-lg">Endrer reservasjon...</span>
      </div>,
      {
        duration: 100000,
        id: "editing-booking",
      },
    );

    try {
      let res = await editBooking(
        values.bookingType,
        format(values.fromDate, formatDbDate),
        format(values.toDate, formatDbDate),
        bookingId,
        values.description,
      );
      toast.dismiss("editing-booking");
      if (res === SUCCESS) {
        toast.success("Reservasjonen ble endret!");
      } else if (res === AUTHENTICATION_ERROR) {
        toast.error("Du må være pålogget for å endre en reservasjon.");
      } else if (res === PERMISSION_ERROR) {
        toast.error("Du kan bare endre dine egne reservasjoner.");
      } else if (res === NOT_FOUND) {
        toast.error("Fant ikke reservasjonen du prøvde å endre.");
      } else {
        toast.error("Noe gikk galt ved endringen av reservasjonen.");
      }
      if (inDialog && setOpen) {
        setOpen(false);
      }
      router.refresh();
    } catch (e) {
      toast.dismiss("editing-booking");
      toast.error("Noe gikk galt ved endringen av reservasjonen.");
    }
  }

  async function onSubmit(values: z.infer<typeof bookingFormSchema>) {
    if (bookingId && prevBookingType) {
      await submitEditBooking(values);
    } else {
      await submitCreateBooking(values);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="bookingType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type reservasjon</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Velg type reservasjon" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Private">Privat</SelectItem>
                  {/*<SelectItem value="Public">Åpen</SelectItem>*/}
                  <SelectItem value="AirBnB">AirBnB</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fromDate"
          render={({ field }) => (
            <FormItem className="flex flex-wrap items-center">
              <div className="flex w-full items-center gap-4">
                <FormLabel>Fra</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, formatDateString)
                        ) : (
                          <span>Velg en dato</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <ShadCalendar
                      mode="single"
                      defaultMonth={field.value}
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < today}
                      initialFocus
                      modifiers={{
                        booked: bookingIntervals,
                        current_booking: bookingId
                          ? { from: selectedDateFrom, to: selectedDateTo }
                          : [],
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="toDate"
          render={({ field }) => (
            <FormItem className="flex flex-wrap items-center">
              <div className="flex w-full items-center gap-4">
                <FormLabel>Til</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, formatDateString)
                        ) : (
                          <span>Velg en dato</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <ShadCalendar
                      mode="single"
                      defaultMonth={field.value}
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < today}
                      initialFocus
                      modifiers={{
                        booked: bookingIntervals,
                        current_booking: bookingId
                          ? { from: selectedDateFrom, to: selectedDateTo }
                          : [],
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beskrivelse</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Valgfri beskrivelse av reservasjonen"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {inDialog ? (
          <DialogFooter>
            <Button variant={"outline"} type="submit" className="m-auto">
              Reserver
            </Button>
          </DialogFooter>
        ) : (
          <Button variant={"outline"} type="submit" className="m-auto">
            Reserver
          </Button>
        )}
      </form>
    </Form>
  );
}
