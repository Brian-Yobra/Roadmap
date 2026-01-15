import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo List | Stay Organized",
  description: "A modern, beautiful todo list application to help you stay organized and get things done.",
  keywords: ["todo", "tasks", "productivity", "organization"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
