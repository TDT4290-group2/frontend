import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Card } from "./card"
import { useTranslation } from "react-i18next";


export function Notifications() {
  const { t } = useTranslation();
  
  const notifications = [
    {
      title: "Vibration",
      translatedTitle: t("notifications.vibration"),
      type: "Danger",
      typeTranslated: t("notifications.danger"),
      date: "21.10.2025 15:26",
    },
    {
      title: "Noise",
      translatedTitle: t("notifications.noise"),
      type: "Warning",
      typeTranslated: t("notifications.warning"),
      date: "01.09.2025 09:41",
    },
    {
      title: "Dust",
      translatedTitle: t("notifications.dust"),
      type: "Warning",
      typeTranslated: t("notifications.warning"),
      date: "04.03.2025 08:53",
    },
    {
      title: "Dust",
      translatedTitle: t("notifications.dust"),
      type: "Warning",
      typeTranslated: t("notifications.warning"),
      date: "19.02.2025 08:54",
    },
  ];
  
  return (
    <Card className="w-full px-4 gap-0 h-64 overflow-y-auto ">
      <ItemGroup className="gap-1">
        {notifications.map((notification) => (
          <Item key={notification.date} variant="outline" asChild role="listitem" className="bg-background rounded-3xl border-3 border-border">
            <li>
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
                  {notification.translatedTitle}
                </ItemTitle>
                <ItemDescription className={
                  notification.type === "Warning" ? "text-[var(--warning)]" : 
                  notification.type === "Danger" ? "text-[var(--danger)]" : 
                  ""
                  }>
                  {notification.typeTranslated}
                </ItemDescription>
              </ItemContent>
              <ItemContent className="flex-none text-center">
                <ItemDescription>{notification.date}</ItemDescription>
              </ItemContent>
            </li>
          </Item>
        ))}
      </ItemGroup>
    </Card>
  )
}
