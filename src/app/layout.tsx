import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from "next/font/google";
import Providers from "./providers";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });
// const exo = localFont({
//   src: "./fonts/Exo.ttf",
//   variable: "--font-exo",
//   weight: "100 900",
// });
// const raleway = Raleway({
//   subsets: ["latin"],
//   variable: "--font-raleway",
// });
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat"
})

export const metadata: Metadata = {
  title: "E-Commerce",
  description: "Sample E-Commerce Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable}`}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}