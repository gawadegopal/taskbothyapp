import "./globals.css";
import SupabaseProvider from "@/lib/supabase/SupabaseProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";

const inter = Inter({
  weight: "400",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          <SupabaseProvider>
            {children}
          </SupabaseProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
