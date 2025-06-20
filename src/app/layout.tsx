import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CS4016 Motion Transfer",
  description: "Crafted @ UTEC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full h-screen bg-black">
        {children}
      </body>
    </html>
  );
}
