import QueryProvider from "@/context/query-provider";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "./globals.css";

const dm_sans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Game Changer Admin Panel",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-background ${dm_sans.className} antialiased`}>
        <QueryProvider>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </QueryProvider>
      </body>
    </html>
  );
}
