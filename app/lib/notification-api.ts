import type { NotificationResponseDto } from "./dto";

const API_BASE_URL = `${import.meta.env.VITE_BASE_URL}notification`;

export async function getNotifications(): Promise<Array<NotificationResponseDto>> {
	const res = await fetch(API_BASE_URL, {
		headers: { Accept: "application/json" },
	});
	if (!res.ok)
		throw new Error(
			`Failed to fetch notifications: ${res.status} ${res.statusText}`,
		);
	return res.json();
}

export const fetchAllNotifications = async (): Promise<
	Array<NotificationResponseDto>
> => {
	const response = await fetch(API_BASE_URL, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});

	if (!response.ok) throw new Error("Failed to fetch notifications");
	return response.json();
};

export const fetchNotificationsByDataType = async (
	dataType: string,
): Promise<Array<NotificationResponseDto>> => {
	const response = await fetch(`${API_BASE_URL}/${dataType}`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});

	if (!response.ok)
		throw new Error(`Failed to fetch notifications for ${dataType}`);
	return response.json();
};

export const fetchNotificationByDataTypeAndDate = async (
	dataType: string,
	happenedAt: string, // ISO string
): Promise<NotificationResponseDto> => {
	const response = await fetch(`${API_BASE_URL}/${dataType}/${happenedAt}`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});

	if (!response.ok)
		throw new Error(
			`Failed to fetch notification for ${dataType} at ${happenedAt}`,
		);
	return response.json();
};
