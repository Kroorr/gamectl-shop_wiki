import {
  getLocaleMetadata,
  LocaleLayoutShell,
  siteViewport,
} from "@/app/_shared/locale-layout";
import { routing } from "@/i18n/routing";
import "../globals.css";

export const viewport = siteViewport;
export const metadata = getLocaleMetadata(routing.defaultLocale);

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <LocaleLayoutShell locale={routing.defaultLocale}>
      {children}
    </LocaleLayoutShell>
  );
}
