import { Toaster } from "@/components/ui/sonner";
import Providers from "@/lib/providers/Providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// const roboto = Roboto({
//   variable: "--font-roboto",
//   subsets: ["latin"],
//   display: "swap",
// });

// const notoBengali = Noto_Sans_Bengali({
//   subsets: ["bengali"],
//   weight: ["400", "500", "600", "700", "800"], // as needed
// });
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"], // as needed
});

export const metadata: Metadata = {
  title: "Gadgetoria",
  description:
    "Discover genuine electronic parts and accessories for every device",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
