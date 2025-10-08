import { isSameMonth, isSameWeek, isToday } from "date-fns";
import { useQueryState } from "nuqs";
import { useState } from "react";
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
	const [notes, setNotes] = useState<Array<Note>>([
		{
			date: today,
			note: "Sanding at 10. This is a long note. A very very very long note. Hopefully it does not make the page look bad or anything.",
		},
		{ date: d1, note: "Welding at 11." },
		{ date: d2, note: "Nothing to report." },
		{ date: d3, note: "Grinding at 12." },
		{ date: d4, note: "Grinding at 12." },
		{ date: d5, note: "Grinding at 12." },
		{ date: d6, note: "Grinding at 12." },
		{ date: d7, note: "Grinding at 12." },
		{ date: d8, note: "Grinding at 12." },
		{ date: d9, note: "Grinding at 12." },
		{ date: d10, note: "Grinding at 12." },
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
					<h2 className="text-xl">{"Daily Note:"}</h2>
				</CardHeader>
				<CardContent>
					{showTextArea ? (
						<Textarea
							placeholder="Write here."
							value={noteText}
							onChange={(e) => setNoteText(e.target.value)}
						/>
					) : (
						<p>{notes[0].note}</p>
					)}
				</CardContent>
				<CardFooter className="justify-end gap-2">
					<Button variant={"secondary"} onClick={handleEdit}>
						{"Edit"}
					</Button>
					<Button disabled={!showTextArea} onClick={handleSubmit}>
						{"Submit"}
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
						{"Notes from this "}
						<strong>{"week"}</strong>
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
					{"Notes from this "}
					<strong>{"month"}</strong>
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
