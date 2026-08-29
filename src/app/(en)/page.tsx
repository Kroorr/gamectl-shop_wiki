import { getHomeMetadata, HomePage } from "@/app/_shared/home-page";
import { routing } from "@/i18n/routing";

export function generateMetadata() {
  return getHomeMetadata(routing.defaultLocale);
}

export default function EnglishHomePage() {
  return <HomePage locale={routing.defaultLocale} />;
}
