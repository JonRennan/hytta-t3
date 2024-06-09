"use client";

import React from "react";
import {
	format,
	addDays,
	startOfWeek,
	endOfWeek,
	getWeek,
	startOfMonth,
	endOfMonth,
	addMonths,
	subMonths,
	setDefaultOptions,
} from "date-fns";
import { nb } from "date-fns/locale";
import styles from "./Calendar.module.css";
import { getCellStyles } from "~/lib/Calendar/utils";

const undefinedDate = new Date(0)

class Calendar extends React.Component {
	state = {
		currentDate: new Date(),
		viewDate: new Date(),
		selectedDateNew: undefinedDate,
		selectedDateOld: undefinedDate,
		airbnbReservation: [new Date(2024, 0, 30), new Date(2024, 1, 15, 23, 59,59, 999)],
	};

	renderHeader() {
		setDefaultOptions({ locale: nb });

		const dateFormat = "MMMM yyyy";

		return (
			<div className={styles.header}>
				<div className={styles.header__icon} onClick={this.prevMonth}>
					{"<"}-
				</div>
				<span>{format(this.state.viewDate, dateFormat)}</span>
				<div className={styles.header__icon} onClick={this.nextMonth}>
					-{">"}
				</div>
			</div>
		);
	}

	renderWeek() {
		const dateFormat = "EEEE";
		const days = [];

		const startDate = startOfWeek(this.state.viewDate);

		days.push(
			<div className={styles.week__number__label} key="week-label">
				#
			</div>,
		);

		for (let i = 0; i < 7; i++) {
			days.push(
				<div className={styles.weekday} key={i}>
					{format(addDays(startDate, i), dateFormat)}
				</div>,
			);
		}

		return <div className={styles.weekdays}>{days}</div>;
	}

	renderCells() {
		const { viewDate, selectedDateNew, selectedDateOld, airbnbReservation } = this.state;
		const monthStart = startOfMonth(viewDate);
		const monthEnd = endOfMonth(monthStart);
		const startDate = startOfWeek(monthStart);
		const endDate = endOfWeek(monthEnd);

		const dateFormat = "d";
		const rows = [];

		let days = [];
		let day = startDate;
		let formattedDate = "";
		let weekNumber = 0;

		while (day <= endDate) {
			weekNumber = getWeek(day);
			days.push(
				<div className={styles.week__number} key={weekNumber}>
					{weekNumber}
				</div>,
			);
			for (let i = 0; i < 7; i++) {
				formattedDate = format(day, dateFormat);
				const cloneDay = day;
				days.push(
					<div
						className={getCellStyles(day, airbnbReservation, selectedDateNew, selectedDateOld, viewDate)}
						key={day.toString()}
						onClick={() => this.onDateClick(cloneDay)}
					>
						<span className={styles.cell__number}>{formattedDate}</span>
						{/*<span className={styles.cell__bg}>{formattedDate}</span>*/}
					</div>,
				);
				day = addDays(day, 1);
			}
			rows.push(
				<div className={styles.week} key={day.toString()}>
					{days}
				</div>,
			);
			days = [];
		}
		return <div className={styles.body}>{rows}</div>;
	}

	onDateClick = (day: Date) => {
		const { selectedDateNew } = this.state

		if (selectedDateNew === undefinedDate) {
			this.setState({
				selectedDateNew: day,
				selectedDateOld: day,
			});
		} else {
			this.setState({
				selectedDateOld: selectedDateNew,
				selectedDateNew: day,
			});
		}
	};

	nextMonth = () => {
		this.setState({
			viewDate: addMonths(this.state.viewDate, 1),
		});
	};

	prevMonth = () => {
		this.setState({
			viewDate: subMonths(this.state.viewDate, 1),
		});
	};

	render() {
		return (
			<div className={styles.calendar}>
				{this.renderHeader()}
				{this.renderWeek()}
				{this.renderCells()}
			</div>
		);
	}
}

export default Calendar;
