import { useRef, useState } from "react";
import { href, NavLink, Outlet, type To, useLocation } from "react-router";
import { ModeToggle } from "@/components/mode-toggle";
import { SidebarInset } from "@/components/ui/sidebar";

export type NavBarLink = {
	to: To;
	label: string;
};

const links: Array<NavBarLink> = [
	{ to: href("/"), label: "Overview" },
	{ to: href("/dust"), label: "Dust" },
	{ to: href("/vibration"), label: "Vibration" },
	{ to: href("/noise"), label: "Noise" },
];

// biome-ignore lint: page components can be default exports
export default function Layout() {
	return (
		<>
			{/* <Sidebar>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>{"Navigation"}</SidebarGroupLabel>
						<SidebarGroupContent>
							<nav>
								<SidebarMenu>
									{links.map((item) => (
										<SidebarMenuItem key={item.to.toString()}>
											<NavLink to={item.to}>{item.label}</NavLink>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
								<NavigationMenu className="max-w-none">
									<NavigationMenuList className="flex-col items-start gap-1">
										{Links}
									</NavigationMenuList>
								</NavigationMenu>
							</nav>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
			</Sidebar> */}
			<SidebarInset>
				<header className="flex items-center justify-between p-2">
					<div className="flex items-center gap-6">
						<NavLink
							to={href("/")}
							className="flex cursor-pointer items-center space-x-2 text-primary transition-colors hover:text-primary/90"
						>
							<div className="text-2xl">
								<Logo />
							</div>
							<span className="text-xl sm:inline-block">{"HealthTech"}</span>
						</NavLink>
					</div>
					<nav className="flex list-none items-center rounded-full">
						<NavTabs routes={links} />
					</nav>
					<ModeToggle />
				</header>
				<main>
					<Outlet />
				</main>
			</SidebarInset>
		</>
	);
}

function NavTabs({ routes }: { routes: Array<{ label: string; to: To }> }) {
	const location = useLocation();
	const navLinkRefs = useRef<Array<HTMLElement>>([]); // Refs to the nav links
	const [pillWidth, setPillWidth] = useState<number>();
	const [pillLeft, setPillLeft] = useState<number>();

	const activeNavIndex = routes.findIndex(
		(route) => route.to === location.pathname,
	);

	return (
		<div className="flew-row relative mx-auto flex h-11 rounded-full bg-accent px-0.5">
			<span
				className="absolute top-0 bottom-0 z-10 flex overflow-hidden rounded-full py-1.5 transition-all duration-300"
				style={{ left: pillLeft, width: pillWidth }}
			>
				<span className="h-full w-full rounded-full bg-primary-foreground shadow-sm" />
			</span>
			{routes.map((route, i) => {
				return (
					<NavLink
						to={route.to}
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
							`${isActive ? "text-black" : "text-neutral-700 hover:text-black"} z-20 my-auto cursor-pointer select-none rounded-full px-4 text-center font-medium text-primary text-sm`
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
