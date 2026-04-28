import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Трекер привычек",
  description: "Минималистичный трекер привычек — отмечайте прогресс каждый день.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-canvas font-sans text-ink">
        {children}
      </body>
    </html>
  );
}
