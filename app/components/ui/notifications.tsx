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
  const { t, i18n } = useTranslation();
  
  const notifications = [
    {
      title: "Noise",
      translatedTitle: t("notifications.noise"),
      type: "Warning",
      typeTranslated: t("notifications.warning"),
      date: "01.04 9.41",
    },
    {
      title: "Vibration",
      translatedTitle: t("notifications.vibration"),
      type: "Danger",
      typeTranslated: t("notifications.danger"),
      date: "24.05 14.04",
    },
    {
      title: "Dust",
      translatedTitle: t("notifications.dust"),
      type: "Warning",
      typeTranslated: t("notifications.warning"),
      date: "04.03 8.53",
    },
    {
      title: "Dust",
      translatedTitle: t("notifications.dust"),
      type: "Warning",
      typeTranslated: t("notifications.warning"),
      date: "04.03 8.53",
    },
  ];
  
  return (
    <Card className="w-full px-4 gap-0 h-64 overflow-y-auto ">
      <ItemGroup className="gap-1">
        {notifications.map((notification) => (
          <Item key={notification.title} variant="outline" asChild role="listitem" className="bg-background rounded-3xl border-3 border-border">
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
