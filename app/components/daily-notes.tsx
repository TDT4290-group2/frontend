import { useView } from "@/features/views/use-view";
import { isSameMonth, isSameWeek, isToday } from "date-fns";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { createNote, fetchNoteData, notesQueryOptions, updateNote } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDate } from "@/features/date-picker/use-date";
import type { Note } from "@/lib/dto";


export const DailyNotes = () => {
	//assumes that the notes are sorted with current day first

	const { t, i18n } = useTranslation();
	const locale = i18n.language;
	const { view } = useView();
	const { date } = useDate();

	const { data, isLoading, isError } = useQuery(notesQueryOptions({ view: view, selectedDay: date }));
	console.log(data)

	const { mutate: mutateUpdateNote } = useMutation({ mutationFn: updateNote });
	const { mutate: mutateCreateNote } = useMutation({ mutationFn: createNote });

	// const todayNoteExists = 

	const [todayNote, setTodayNote] = useState<Note | null>(data ? data.find((note) => isToday(note.time)) ?? null : null);

	const [showTextArea, setShowTextArea] = useState<boolean>(
		todayNote === null
	);

	const handleEdit = () => {
		setShowTextArea(!showTextArea);
	};

	const handleSubmit = () => {
		if (todayNote !== null) {
			mutateCreateNote({ note: todayNote })

		}


		setShowTextArea(false);
	};

	if (isLoading) {
		return <Card className="flex h-24 w-full items-center">
			<p>{t(($) => $.loadingData)}</p>
		</Card>
	}

	if (isError) {
		return <Card className="flex h-24 w-full items-center">
			<p>{t(($) => $.loadingData)}</p>
		</Card>
	}


	if (view === "day") {
		return (
			<Card className="max-h-96 w-full overflow-y-auto">
				<CardHeader>
					<h2 className="text-xl">{t(($) => $.daily_notes.dayTitle)}</h2>
				</CardHeader>
				<CardContent>
					{data?.find((note) => isToday(note.time)) ? (
						<p>{data?.find((note) => isToday(note.time))?.note}</p>
					) : (
						<Textarea
							placeholder={t(($) => $.daily_notes.writeHere)}
							value={todayNote ? todayNote.note : ""}
							onChange={(e) => setTodayNote({ time: new Date, note: e.target.value })}
						/>
					)}
				</CardContent>
				<CardFooter className="justify-end gap-2">
					<Button variant={"secondary"} onClick={handleEdit}>
						{t(($) => $.daily_notes.edit)}
					</Button>
					<Button disabled={!showTextArea} onClick={handleSubmit}>
						{t(($) => $.daily_notes.save)}
					</Button>
				</CardFooter>
			</Card>
		);
	}

	if (view === "week") {
		return (
			<Card className="max-h-96 w-full overflow-y-auto">
				<CardHeader>
					<h2 className="text-xl">
						{t(($) => $.daily_notes.notesFromThis)}
						<strong>{t(($) => $.daily_notes.week)}</strong>
						{":"}
					</h2>
				</CardHeader>
				<CardContent>
					<ul>
						{data ?
							data.filter((note) =>
								isSameWeek(new Date(), note.time, { weekStartsOn: 1 }),
							)
								.map((note) => (
									<li key={note.time.toDateString()}>
										<strong>
											{note.time.toLocaleDateString(locale, {
												day: "numeric",
												month: "long",
											})}
											{": "}
										</strong>
										{note.note}
									</li>
								)) : null}
					</ul>
				</CardContent>
			</Card>
		);
	}

	//month-view
	return (
		<Card className="max-h-96 w-full overflow-y-auto">
			<CardHeader>
				<h2 className="text-xl">
					{t(($) => $.daily_notes.notesFromThis)}
					<strong>{t(($) => $.daily_notes.month)}</strong>
					{":"}
				</h2>
			</CardHeader>
			<CardContent>
				<ul>
					{data ?
						data.filter((note) => isSameMonth(new Date(), note.time))
							.map((note) => (
								<li key={note.time.getTime()}>
									<strong>
										{note.time.toLocaleDateString(locale, {
											day: "numeric",
											month: "long",
										})}
										{": "}
									</strong>
									{note.note}
								</li>
							)) : null}
				</ul>
			</CardContent>
		</Card>
	);
};

export const PopupNotes = ({ selectedDate }: { selectedDate: Date }) => {
	const { t } = useTranslation();

	const [note, setNote] = useState<Note>({
		time: new Date,
		note: "Popup placeholder notat - må fikse funksjonaliteten her",
	});

	const [showTextArea, setShowTextArea] = useState<boolean>(
		!isToday(note.time),
	);
	const [noteText, setNoteText] = useState<string>(note.note);

	const handleEdit = () => {
		setShowTextArea(!showTextArea);
	};

	const handleSubmit = () => {
		//this will be replaced by api call
		setNote({ time: selectedDate, note: noteText });
		setShowTextArea(false);
	};
	return (
		<Card className="max-h-64 w-full overflow-y-auto">
			<CardContent>
				{showTextArea ? (
					<Textarea
						placeholder={t(($) => $.daily_notes.writeHere)}
						value={noteText}
						onChange={(e) => setNoteText(e.target.value)}
					/>
				) : (
					<p>{note.note}</p>
				)}
			</CardContent>
			<CardFooter className="justify-end gap-2">
				<Button variant={"secondary"} onClick={handleEdit}>
					{t(($) => $.daily_notes.edit)}
				</Button>
				<Button disabled={!showTextArea} onClick={handleSubmit}>
					{t(($) => $.daily_notes.save)}
				</Button>
			</CardFooter>
		</Card>
	);
};
