import { Outlet } from "react-router";
import {
	NavBar,
	NavBarItem,
	type NavBarLink,
	NavBarMenu,
	NavBarTitle,
} from "../components/navbar";

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
				<NavBar>
					<NavBarTitle />
					<NavBarMenu>
						{links.map((link) => (
							<NavBarItem key={link.href} link={link}></NavBarItem>
						))}
					</NavBarMenu>
				</NavBar>
			</header>
			<main>
				<Outlet />
			</main>
		</>
	);
}
