import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Montserrat } from "next/font/google";

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
    // <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>  
    <html lang="en" className={`${montserrat.variable}`}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}