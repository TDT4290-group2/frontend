"use client";

import * as React from "react";
import { useRef } from "react";
import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useIsMobile } from "../hooks/use-mobile";
import { ModeToggle } from "./mode-toggle";

// Simple logo component for the navbar
const Logo = () => (
	<svg
		width="44"
		height="40"
		viewBox="0 0 44 40"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<title>{"Logo"}</title>
		<path
			d="M42.8334 20H34.5001L28.2501 38.75L15.7501 1.25L9.50008 20H1.16675"
			stroke="#A4D4DB"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

// Hamburger icon component
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

// Types
export type NavBarLink = {
	href: string;
	label: string;
};

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
	logo?: React.ReactNode;
	logoHref?: string;
	navigationLinks: Array<NavBarLink>;
	signInText?: string;
	signInHref?: string;
	ctaText?: string;
	ctaHref?: string;
	onSignInClick?: () => void;
	onCtaClick?: () => void;
}

export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
	(
		{ className, logo = <Logo />, logoHref = "/", navigationLinks, ...props },
		ref,
	) => {
		const containerRef = useRef<HTMLElement>(null);
		const isMobile = useIsMobile();

		// Combine refs
		const combinedRef = React.useCallback(
			(node: HTMLElement | null) => {
				containerRef.current = node;
				if (typeof ref === "function") {
					ref(node);
				} else if (ref) {
					ref.current = node;
				}
			},
			[ref],
		);

		return (
			<div
				ref={combinedRef}
				className={cn(
					"sticky top-0 z-50 w-full bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6 [&_*]:no-underline",
					className,
				)}
				{...props}
			>
				<div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
					{/* Left side */}
					<div className="flex items-center gap-2">
						{/* Mobile menu trigger */}
						{isMobile && (
							<Popover>
								<PopoverTrigger asChild>
									<Button className="group h-9 w-9" variant="ghost" size="icon">
										<HamburgerIcon />
									</Button>
								</PopoverTrigger>
								<PopoverContent align="start" className="w-48 p-2">
									<NavigationMenu className="max-w-none">
										<NavigationMenuList className="flex-col items-start gap-1">
											{navigationLinks.map((link) => (
												<NavigationMenuItem key={link.href} className="w-full">
													<NavLink
														to={link.href}
														className={({ isActive, isPending }) =>
															cn(
																"flex w-full cursor-pointer items-center rounded-md px-3 py-2 font-medium text-sm no-underline transition-colors hover:underline",
																isActive && "font-bold",
																isPending && "text-muted-foreground",
															)
														}
													>
														{link.label}
													</NavLink>
												</NavigationMenuItem>
											))}
										</NavigationMenuList>
									</NavigationMenu>
								</PopoverContent>
							</Popover>
						)}
						{/* Main nav */}
						<div className="flex items-center gap-6">
							<NavLink
								to={logoHref}
								className="flex cursor-pointer items-center space-x-2 text-primary transition-colors hover:text-primary/90"
							>
								<div className="text-2xl">{logo}</div>
								<span className="text-xl sm:inline-block">
									{"Aker Solutions"}
								</span>
							</NavLink>
							{/* Navigation menu */}
							{!isMobile && (
								<NavigationMenu className="flex rounded-3xl bg-card">
									<NavigationMenuList className="gap-1">
										{navigationLinks.map((link) => (
											<NavigationMenuItem key={link.href}>
												<NavLink
													to={link.href}
													className={({ isActive, isPending }) =>
														cn(
															"group inline-flex h-9 w-max cursor-pointer items-center justify-center rounded-md px-4 py-2 font-medium text-sm transition-colors hover:underline disabled:pointer-events-none disabled:opacity-50",
															isActive && "font-bold",
															isPending && "text-muted-foreground",
														)
													}
												>
													{link.label}
												</NavLink>
											</NavigationMenuItem>
										))}
									</NavigationMenuList>
								</NavigationMenu>
							)}
							<ModeToggle /> {/* Can be removed or moved later */}
						</div>
					</div>
				</div>
			</div>
		);
	},
);

Navbar.displayName = "Navbar";

export { Logo, HamburgerIcon };
