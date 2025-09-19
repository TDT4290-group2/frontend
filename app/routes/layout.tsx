import { Outlet } from "react-router";
import { type NavBarLink, Navbar } from "../components/navbar";

const links: Array<NavBarLink> = [
	{ href: "/", label: "Overview" },
	{ href: "/dust", label: "Dust" },
	{ href: "/vibration", label: "Vibration" },
	{ href: "/noise", label: "Noise" },
];

// biome-ignore lint: page components can be default exports
export default function Layout() {
	return (
		<>
			<header>
				<Navbar navigationLinks={links} />
			</header>
			<main>
				<Outlet />
			</main>
		</>
	);
}
