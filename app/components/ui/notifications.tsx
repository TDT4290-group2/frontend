import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

const notifications = [
  {
    title: "Noise",
    type: "Warning",
    date: "Wed 1st April 9.41 AM",
  },
  {
    title: "Vibration",
    type: "Danger",
    date: "Thu 24th May 2.04 PM",
  },
  {
    title: "Dust",
    type: "Warning",
    date: "Mon 4th Mar 8.53 AM",
  },
  {
    title: "Dust",
    type: "Warning",
    date: "Mon 4th Mar 8.53 AM",
  },
]

export function Notifications() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <ItemGroup className="gap-1">
        {notifications.map((notification) => (
          <Item key={notification.title} variant="outline" asChild role="listitem" className=" bg-[var(--background)] rounded-3xl border-3 border-[var(--border)]">
            <a href="#">
              <ItemMedia variant="image">
                <img 
                  src={
                    notification.title === "Noise"
                      ? "icons/noiseIcon.png"
                    : notification.title === "Vibration"
                      ? "icons/vibrationIcon.png"
                    : notification.title === "Dust"
                      ? "icons/dustIcon.png"
                    : ""
                  }
                alt={`${notification.title} Icon`}
                />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="line-clamp-1">
                  {notification.title}
                </ItemTitle>
                <ItemDescription className={
                  notification.type === "Warning" ? "text-[var(--warning)]" : 
                  notification.type === "Danger" ? "text-[var(--danger)]" : 
                  ""
                  }>
                  {notification.type}
                </ItemDescription>
              </ItemContent>
              <ItemContent className="flex-none text-center">
                <ItemDescription>{notification.date}</ItemDescription>
              </ItemContent>
            </a>
          </Item>
        ))}
      </ItemGroup>
    </div>
  )
}
