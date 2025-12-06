import { Toaster } from "@/components/ui/sonner";
import Providers from "@/lib/providers/Providers";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const FacebookPixel = dynamic(
  () => import("@/components/shared/Config/FacebookPixel")
);

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
  title: "Pushtihub",
  description: "Eat & Live Healthy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="gtm-base"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`,
          }}
        />
      </head>
      <body
        className={`${inter.className} antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100`}
        suppressHydrationWarning
      >
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <Providers>
          <FacebookPixel />
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
