import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Template",
  description:
    "Сравнение на политически обещания, действия и източници.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
