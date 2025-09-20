import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import localFont from 'next/font/local'
import { Footer } from "@/components/Footer";
import { NavBar } from "@/components/NavBar";
import "./globals.css";
import { createClient } from "@/prismicio";
import { isFilled } from "@prismicio/client";
import { ViewTransitions } from "next-view-transitions";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  display: "swap"
});

const gambarino = localFont({
  src: './gambarino.woff2',
  display: "swap",
  variable: "--font-gambarino",
})

export async function generateMetdata(): Promise<Metadata>{
  const client = createClient()
  const settings = await client.getSingle("settings")
  return{
    title: settings.data.site_title || "Côte Royal Paris",
    description: settings.data.meta_description || "Discover the fragrance crafted for you. Take our short quiz to uncover which Côte Royale scent aligns with your character, energy, and the impression you want to leave behind.",
    openGraph: {
      images: isFilled.image(settings.data.fallback_og_image) ? [settings.data.fallback_og_image.url] : ["/cote-royale-og-image.png"]
    }
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = createClient()
  const settings = await client.getSingle("settings")

  return (
    <ViewTransitions>
    <html lang="en" className={`${raleway.variable} ${gambarino.variable} antialiased`}>
      <body className="bg-neutral-900 text-white">
        <NavBar settings={settings}/>
        <main className="pt-14 md:pt-16">
          {children}
        </main>

        <Footer />
      </body>
    </html>
    </ViewTransitions>
  );
}
