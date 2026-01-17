import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Compila.dev - Pratique programação com desafios reais em português",
  description:
    "Mais de 500 desafios de programação em Frontend, Backend, Mobile, IoT e DevOps. Feedback por IA, portfólio público e comunidade brasileira. Comece grátis!",
  keywords: [
    "desafios programação",
    "exercícios código",
    "praticar programação",
    "desafios frontend",
    "desafios backend",
    "aprender programação praticando",
    "portfólio desenvolvedor",
    "comunidade programadores brasil",
    "feedback código ia",
  ],
  authors: [{ name: "Compila.dev" }],
  creator: "Compila.dev",
  publisher: "Compila.dev",
  metadataBase: new URL("https://compila.dev"),
  openGraph: {
    title: "Compila.dev - Compile conhecimento, execute sua carreira",
    description:
      "Pratique programação com 500+ desafios reais. 100% em português.",
    url: "https://compila.dev",
    siteName: "Compila.dev",
    images: [
      {
        url: "https://compila.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "Compila.dev - Plataforma de desafios de programação",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compila.dev",
    description: "500+ desafios de programação em português",
    images: ["https://compila.dev/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // google: "verification-token",
    // yandex: "verification-token",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
