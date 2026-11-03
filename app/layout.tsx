import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider, LanguageSwitcher } from "@/components/i18n-provider";

export const metadata: Metadata = {
  title: "ClasseTrading — Academia de Trading",
  description: "Formation structurée en trading, analyse de marché et classes en direct.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fr"><body><I18nProvider><LanguageSwitcher />{children}</I18nProvider></body></html>;
}
