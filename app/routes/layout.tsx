import type { ComponentProps } from "react";
import { Outlet } from "react-router";
import { Calendars } from "@/components/calendars";
import { DatePicker } from "@/components/date-picker";
import { ModeToggle } from "@/components/mode-toggle";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarProvider,
	SidebarRail,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import { Navbar, type NavLink } from "../components/navbar";

// This is sample data.
const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	calendars: [
		{
			name: "My Calendars",
			items: ["Personal", "Work", "Family"],
		},
		{
			name: "Favorites",
			items: ["Holidays", "Birthdays"],
		},
		{
			name: "Other",
			items: ["Travel", "Reminders", "Deadlines"],
		},
	],
};

const links: Array<NavLink> = [
	{ href: "/", label: "Overview" },
	{ href: "/dust", label: "Dust" },
	{ href: "/vibration", label: "Vibration" },
	{ href: "/noise", label: "Noise" },
];

// biome-ignore lint: page components can be default exports
export default function Layout() {
	return (
		<>
			<Navbar navigationLinks={links} />
			<SidebarProvider>
				<AppSidebar />
				<Outlet />
			</SidebarProvider>
		</>
	);
}

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar {...props}>
			<SidebarHeader className="h-16 border-sidebar-border border-b"></SidebarHeader>
			<SidebarContent>
				<DatePicker />
				<SidebarSeparator className="mx-0" />
				<Calendars calendars={data.calendars} />
			</SidebarContent>
			<SidebarFooter>
				<ModeToggle />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
