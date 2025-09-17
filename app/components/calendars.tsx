import { Check, ChevronRight } from "lucide-react";
import { Fragment } from "react/jsx-runtime";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from "@/components/ui/sidebar";

export function Calendars({
	calendars,
}: {
	calendars: Array<{
		name: string;
		items: Array<string>;
	}>;
}) {
	return (
		<>
			{calendars.map((calendar, index) => (
				<Fragment key={calendar.name}>
					<SidebarGroup key={calendar.name} className="py-0">
						<Collapsible
							defaultOpen={index === 0}
							className="group/collapsible"
						>
							<SidebarGroupLabel
								asChild
								className="group/label w-full text-sidebar-foreground text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
							>
								<CollapsibleTrigger>
									{calendar.name}{" "}
									<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
								</CollapsibleTrigger>
							</SidebarGroupLabel>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenu>
										{calendar.items.map((item, i) => (
											<SidebarMenuItem key={item}>
												<SidebarMenuButton>
													<div
														data-active={i < 2}
														className="group/calendar-item flex aspect-square size-4 shrink-0 items-center justify-center rounded-sm border border-sidebar-border text-sidebar-primary-foreground data-[active=true]:border-sidebar-primary data-[active=true]:bg-sidebar-primary"
													>
														<Check className="hidden size-3 group-data-[active=true]/calendar-item:block" />
													</div>
													{item}
												</SidebarMenuButton>
											</SidebarMenuItem>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</CollapsibleContent>
						</Collapsible>
					</SidebarGroup>
					<SidebarSeparator className="mx-0" />
				</Fragment>
			))}
		</>
	);
}
