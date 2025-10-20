import { isSameMonth, isSameWeek, isToday } from "date-fns";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { parseAsView } from "../lib/utils";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Textarea } from "./ui/textarea";

type Note = {
	date: Date;
	note: string;
};

const d1 = new Date(2025, 9, 7);
const d2 = new Date(2025, 9, 6);
const d3 = new Date(2025, 9, 3);
const d4 = new Date(2025, 9, 2);
const d5 = new Date(2025, 9, 1);
const d6 = new Date(2025, 9, 1);
const d7 = new Date(2025, 9, 1);
const d8 = new Date(2025, 9, 1);
const d9 = new Date(2025, 9, 1);
const d10 = new Date(2025, 9, 1);
const today = new Date();

const locale = "en-GB"; //nb-NO: bokmål, nn-NO: nynorsk

export const DailyNotes = () => {
	//assumes that the notes are sorted with current day first

	const { t } = useTranslation();

	const [notes, setNotes] = useState<Array<Note>>([
		{
			date: today,
			note: "Sandblåsing kl 10. Dette er et langt notat. Et veldig veldig veldig langt notat. Forhåpentligvis gjør det ikke at siden ser dårlig ut eller noe.",
		},
		{ date: d1, note: "Sveising kl 11." },
		{ date: d2, note: "Ingenting å rapportere." },
		{ date: d3, note: "Slipemaskin kl 12." },
		{ date: d4, note: "Slipemaskin kl 12." },
		{ date: d5, note: "Slipemaskin kl 12." },
		{ date: d6, note: "Slipemaskin kl 12." },
		{ date: d7, note: "Slipemaskin kl 12." },
		{ date: d8, note: "Slipemaskin kl 12." },
		{ date: d9, note: "Slipemaskin kl 12." },
		{ date: d10, note: "Slipemaskin kl 12." },
	]);
	const [view] = useQueryState("view", parseAsView.withDefault("day"));
	const [showTextArea, setShowTextArea] = useState<boolean>(
		!notes.some((note) => isToday(note.date)),
	);
	const [noteText, setNoteText] = useState<string>(notes[0].note);

	const handleEdit = () => {
		setShowTextArea(!showTextArea);
	};

	const handleSubmit = () => {
		//this will be replaced by api call
		if (notes.some((note) => isToday(note.date))) {
			notes[0] = { date: new Date(), note: noteText };
		} else {
			setNotes([{ date: new Date(), note: noteText } as Note].concat(notes));
		}
		setShowTextArea(false);
	};

	if (view === "day") {
		return (
			<Card className="max-h-64 w-full overflow-y-auto">
				<CardHeader>
					<h2 className="text-xl">{t("daily_notes.dayTitle")}</h2>
				</CardHeader>
				<CardContent>
					{showTextArea ? (
						<Textarea
							placeholder={t("daily_notes.writeHere")}
							value={noteText}
							onChange={(e) => setNoteText(e.target.value)}
						/>
					) : (
						<p>{notes[0].note}</p>
					)}
				</CardContent>
				<CardFooter className="justify-end gap-2">
					<Button variant={"secondary"} onClick={handleEdit}>
						{t("daily_notes.edit")}
					</Button>
					<Button disabled={!showTextArea} onClick={handleSubmit}>
						{t("daily_notes.save")}
					</Button>
				</CardFooter>
			</Card>
		);
	}

	if (view === "week") {
		return (
			<Card className="max-h-64 w-full overflow-y-auto">
				<CardHeader>
					<h2 className="text-xl">
						{t("daily_notes.notesFromThis")}
						<strong>{t("daily_notes.week")}</strong>
						{":"}
					</h2>
				</CardHeader>
				<CardContent>
					<ul>
						{notes
							.filter((note) =>
								isSameWeek(new Date(), note.date, { weekStartsOn: 1 }),
							)
							.map((note) => (
								<li key={note.date.toDateString()}>
									<strong>
										{note.date.toLocaleDateString(locale, {
											day: "numeric",
											month: "long",
										})}
										{": "}
									</strong>
									{note.note}
								</li>
							))}
					</ul>
				</CardContent>
			</Card>
		);
	}

	//month-view
	return (
		<Card className="max-h-64 w-full overflow-y-auto">
			<CardHeader>
				<h2 className="text-xl">
					{t("daily_notes.notesFromThis")}
					<strong>{t("daily_notes.month")}</strong>
					{":"}
				</h2>
			</CardHeader>
			<CardContent>
				<ul>
					{notes
						.filter((note) => isSameMonth(new Date(), note.date))
						.map((note) => (
							<li key={note.date.toDateString()}>
								<strong>
									{note.date.toLocaleDateString(locale, {
										day: "numeric",
										month: "long",
									})}
									{": "}
								</strong>
								{note.note}
							</li>
						))}
				</ul>
			</CardContent>
		</Card>
	);
};
