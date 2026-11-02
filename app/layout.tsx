import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClasseTrading — Academia de Trading",
  description: "Formación estructurada en trading, análisis de mercado y clases en vivo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es"><body>{children}</body></html>;
}
