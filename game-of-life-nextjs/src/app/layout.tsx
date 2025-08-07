import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeRegistry from "./components/config/themeRegistry";
import DashboardLayout from "./components/DashBoardLayout";
import JotaiProvider from "./components/config/jotaiWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  // Note o "m" minúsculo e o tipo Metadata
  title: "Simulação de Epidemia com Autómatos Celulares e AG",
  description:
    "modelo híbrido para simular a dinâmica de doenças infecciosas, integrando a Modelagem Baseada em Agentes (ABM) com um ambiente de Autômatos Celulares (AC)",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
    other: [
      {
        rel: "web-app-manifest",
        url: "/site.webmanifest",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <JotaiProvider>
          <ThemeRegistry>
            <DashboardLayout>{children}</DashboardLayout>
          </ThemeRegistry>
        </JotaiProvider>
      </body>
    </html>
  );
}
