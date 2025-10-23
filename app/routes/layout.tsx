import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { parseAsView } from "@/features/views/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/ui/select";
import { useQueryState } from "nuqs";
import { type ReactNode, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	href,
	Link,
	NavLink,
	Outlet,
	type To,
	useLocation,
} from "react-router";
import { sensors } from "../features/sensor-picker/sensors";
import { useSensor } from "../features/sensor-picker/use-sensor";

const Logo = () => (
	<svg
		width="44"
		height="40"
		viewBox="0 0 44 40"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<title>{"HealthTech Logo"}</title>
		<path
			d="M42.8334 20H34.5001L28.2501 38.75L15.7501 1.25L9.50008 20H1.16675"
			stroke="#A4D4DB"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

function HomeLink() {
	return (
		<NavLink
			to={href("/")}
			className="flex cursor-pointer items-center space-x-2 text-foreground transition-colors hover:text-primary/90"
		>
			<div className="text-2xl">
				<Logo />
			</div>
			<span className="text-xl sm:inline-block">{"HealthTech"}</span>
		</NavLink>
	);
}

// biome-ignore lint: page components can be default exports
export default function Layout() {
	const isMobile = useIsMobile();

	const { t, i18n } = useTranslation();

	const links: Array<{ to: To; label: string }> = [
		{ to: href("/"), label: t("layout.overview") },
		{ to: href("/dust"), label: t("layout.dust") },
		{ to: href("/vibration"), label: t("layout.vibration") },
		{ to: href("/noise"), label: t("layout.noise") },
	];

	return (
		<SidebarProvider defaultOpen={false}>
			<SidebarInset>
				<header className="flex items-center justify-between p-2">
					{isMobile ? (
						<>
							<div className="flex items-center gap-6">
								<MobileMenu routes={links}>
									<DrawerTrigger>
										<HamburgerButton />
									</DrawerTrigger>
								</MobileMenu>
							</div>

							<HomeLink />
						</>
					) : (
						<>
							<div className="flex items-center gap-6">
								<HomeLink />
							</div>

							<nav className="flex list-none items-center rounded-full">
								<NavTabs routes={links} />
							</nav>
						</>
					)}
					<div className="flex flex-row gap-4">
						<Select onValueChange={(value) => i18n.changeLanguage(value)}>
							<SelectTrigger className="w-32">
								<SelectValue placeholder="Language" />
							</SelectTrigger>
							<SelectContent className="w-32">
								<SelectItem key={"en"} value={"en"}>
									{t("layout.english")}
								</SelectItem>
								<SelectItem key={"no"} value={"no"}>
									{t("layout.norwegian")}
								</SelectItem>
							</SelectContent>
						</Select>
						<ModeToggle />
					</div>
				</header>
				<main className="m-2 flex items-center justify-center">
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}

function NavTabs({ routes }: { routes: Array<{ label: string; to: To }> }) {
	const [view] = useQueryState("view", parseAsView.withDefault("day"));
	const location = useLocation();
	const { setSensor } = useSensor();
	const navLinkRefs = useRef<Array<HTMLElement>>([]); // Refs to the nav links
	const [pillWidth, setPillWidth] = useState<number>();
	const [pillLeft, setPillLeft] = useState<number>();

	const activeNavIndex = routes.findIndex(
		(route) => route.to === location.pathname,
	);

	return (
		<div className="flew-row relative mx-auto flex h-11 rounded-full bg-[var(--card)] px-2">
			<span
				className="absolute top-0 bottom-0 z-10 flex overflow-hidden rounded-full py-1.5 transition-all duration-300"
				style={{ left: pillLeft, width: pillWidth }}
			>
				<span className="h-full w-full rounded-full bg-secondary shadow-sm" />
			</span>
			{routes.map((route, i) => {
				return (
					<NavLink
						to={{
							pathname: route.to.toString(),
							search: `?view=${view}`,
						}}
						onClick={() =>
							sensors.find(
								(s) => route.to.toString().includes(s) && setSensor(s),
							)
						}
						key={route.to.toString()}
						ref={(el) => {
							if (!el) return;

							// Add the ref to the array
							navLinkRefs.current[i] = el;
							// If the current link is the active one, set the pill width and left offset
							if (i === activeNavIndex) {
								setPillWidth(el.offsetWidth);
								setPillLeft(el.offsetLeft);
							}
						}}
						className={({ isActive }) =>
							`${isActive ?? "text-foreground"} z-20 my-auto cursor-pointer select-none rounded-full px-4 text-center font-medium text-muted-foreground text-sm hover:text-foreground`
						}
						prefetch="intent"
					>
						{route.label}
					</NavLink>
				);
			})}
		</div>
	);
}

function MobileMenu({
	routes,
	children,
}: {
	routes: Array<{ label: string; to: To }>;
	children?: ReactNode;
}) {
	return (
		<div className="md:hidden">
			<Drawer>
				{children}
				<DrawerContent>
					<DrawerHeader />
					<DrawerDescription>
						<div className="flex items-start justify-between p-6">
							<ul className="flex w-full flex-col items-start gap-4 text-center">
								{routes.map((route) => (
									<li key={route.to.toString()}>
										<Link
											className="text-lg text-primary"
											to={route.to}
											prefetch="render"
										>
											{route.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</DrawerDescription>
					<DrawerFooter>
						<DrawerClose>
							<Button variant="outline">{"Close"}</Button>
						</DrawerClose>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</div>
	);
}

function HamburgerButton() {
	return (
		<Button variant={"ghost"} size={"icon"}>
			<HamburgerIcon />
		</Button>
	);
}

const HamburgerIcon = ({
	className,
	...props
}: React.SVGAttributes<SVGElement>) => (
	<svg
		className={cn("pointer-events-none scale-250", className)}
		width={16}
		height={16}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<title>{"Menu Icon"}</title>
		<path
			d="M4 12L20 12"
			className="-translate-y-[7px] origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
		/>
		<path
			d="M4 12H20"
			className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
		/>
		<path
			d="M4 12H20"
			className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
		/>
	</svg>
);
