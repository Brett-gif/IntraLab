import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Sans } from "next/font/google";

const display = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-display" });
const body = IBM_Plex_Sans({ subsets: ["latin"], variable: "--font-body", weight: ["300", "400", "500", "600"] });

export const metadata: Metadata = {
  title: "LabBridge",
  description: "Translate wet and dry lab updates & keep a shared lab timeline."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} font-body gradient-shell min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
