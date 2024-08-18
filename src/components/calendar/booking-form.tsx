import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";

import { format, setDefaultOptions } from "date-fns";
import { nb } from "date-fns/locale";

import { CalendarIcon } from "lucide-react";
import Link from "next/link";
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
import { isAuthenticationError, isPermissionError } from "~/errors";

import { cn } from "~/lib/utils";
import { createBooking } from "~/server/actions";
import { createBookingFormSchema, formatDateString, today } from "~/types";

interface BookingFormProps {
  selectedDateFrom?: Date;
  selectedDateTo?: Date;
  inDialog: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function BookingForm({
  selectedDateFrom,
  selectedDateTo,
  inDialog = false,
  setOpen,
}: BookingFormProps) {
  setDefaultOptions({ locale: nb });
  const router = useRouter();

  const form = useForm<z.infer<typeof createBookingFormSchema>>({
    resolver: zodResolver(createBookingFormSchema),
    defaultValues: {
      bookingType: "Private",
      fromDate: selectedDateFrom,
      toDate: selectedDateTo,
    },
  });

  const { isLoaded, userId } = useAuth();
  if (!isLoaded || !userId) {
    return (
      <div>
        <Link href={"/logg-inn/"}>
          <Button variant={"link"}>Logg inn</Button>
        </Link>
        for å reservere hytta
      </div>
    );
  }

  async function onSubmit(values: z.infer<typeof createBookingFormSchema>) {
    toast(
      <div className="flex items-center gap-2 text-white">
        <Spinner /> <span className="text-lg">Lager reservasjon...</span>
      </div>,
      {
        duration: 100000,
        id: "creating-booking",
      },
    );

    try {
      await createBooking(
        values.bookingType,
        values.fromDate,
        values.toDate,
        values.description,
      );
      toast.dismiss("creating-booking");
      toast.success("Reservasjonen ble laget!");
      if (inDialog && setOpen) {
        setOpen(false);
      }
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.dismiss("creating-booking");

      if (e instanceof Error && isAuthenticationError(e)) {
        toast.error("Du må være pålogget for å reservere hytta.");
      } else if (e instanceof Error && isPermissionError(e)) {
        toast.error(
          "Du mangler tillatelse til å reservere hytta. Kontakt Jon hvis du mener det er feil.",
        );
      } else {
        toast.error("Noe gikk galt i opprettingen av reservasjonen.");
      }

      if (inDialog && setOpen) {
        setOpen(false);
      }
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
                  <SelectItem value="Public">Åpen</SelectItem>
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
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < today}
                      initialFocus
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
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < today}
                      initialFocus
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
            <Button type="submit">Reserver</Button>
          </DialogFooter>
        ) : (
          <Button type="submit">Reserver</Button>
        )}
      </form>
    </Form>
  );
}
