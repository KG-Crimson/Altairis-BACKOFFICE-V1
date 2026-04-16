import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./Sidebar";
import Header from "./Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BackOffice Altairis",
  description: "Panel administrativo Altairis",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="app-layout">
          <Sidebar />
          <main className="main">
            <Header />
            <div className="content">
              <div className="app-container">{children}</div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
