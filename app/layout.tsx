import type { Metadata } from "next";
import "@/styles/globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "PreSign - Reduce Failed Deliveries for Signature-Required Packages",
  description: "Give customers a simple, secure way to authorize delivery before the carrier arrives. Reduce failed delivery attempts and increase customer satisfaction.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

