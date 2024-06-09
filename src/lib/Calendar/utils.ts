import {
	isSameMonth,
	isBefore,
	isSameDay,
	differenceInCalendarDays,
	isPast,
	isWithinInterval,
} from "date-fns";
import styles from "~/ui/Calendar/Calendar.module.css";

function isDisabled(day: Date, viewDate: Date): boolean {
	return !isSameMonth(day, viewDate) || isPast(day.setHours(23, 59, 59, 999));
}

function isSelected(	day: Date,	selectedDateNew: Date,	selectedDateOld: Date): boolean {
	return (
		isWithinInterval(day.setHours(0,0,0,0), { start: selectedDateNew.setHours(0,0,0,0), end: selectedDateOld.setHours(0,0,0,0) }) &&
		Math.abs(differenceInCalendarDays(selectedDateNew, selectedDateOld)) < 60
	);
}

function getSelectedStyle(day: Date,	selectedDateNew: Date,	selectedDateOld: Date, isInteractive  = false): string {
	let selectedStyle: string = styles.cell__selected!;

	const isNewFirst = isBefore(selectedDateNew, selectedDateOld);

	if (isSameDay(selectedDateNew, selectedDateOld)) {
		selectedStyle += ` ${styles.cell__selected__only}`;
	} else if (isSameDay(day, selectedDateNew) || isSameDay(day, selectedDateOld)) {
		if ((isNewFirst && isSameDay(day, selectedDateNew)) || (!isNewFirst && isSameDay(day, selectedDateOld))) {
			selectedStyle += ` ${styles.cell__selected__first}`;
		} else {
			selectedStyle += ` ${styles.cell__selected__last}`;
		}

		if (isInteractive) {
			if (isSameDay(day, selectedDateNew)){
				selectedStyle += ` ${styles.selectedNew}`
			} else if (isSameDay(day, selectedDateOld)){
				selectedStyle += ` ${styles.selectedOld}`
			}
		}
	}
	if (Math.abs(differenceInCalendarDays(selectedDateNew, selectedDateOld)) > 6) {
		selectedStyle += ` ${styles.isLongerThanWeek}`;
	}
	return selectedStyle;
}

function isBooked(day: Date, booking: Date[]): boolean {
	return isWithinInterval(day, { start: booking[0]!, end: booking[1]! });
}

export function getCellStyles(day: Date, airbnbReservation: Date[], selectedDateNew: Date, selectedDateOld: Date, viewDate: Date): string {
	let cellStyles = styles.cell!;

	if (isBooked(day, airbnbReservation)) {
		cellStyles += ` ${styles.airbnb} ${styles.booked} ${getSelectedStyle(day, airbnbReservation[0]!, airbnbReservation[1]!)}`
	} else if (isSelected(day, selectedDateNew, selectedDateOld)) {
		cellStyles += ` ${getSelectedStyle(day, selectedDateNew, selectedDateOld, true)}`
	} else if (isDisabled(day, viewDate)){
		cellStyles += ` ${styles.cell__disabled}`
	}

	return cellStyles
}
