import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import Navigation from "./components/shared/navigation";
import Header from "./components/shared/header";
import Footer from "./components/shared/footer";
import { DataProvider } from "./Context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clear The Chips - Online Poker",
  description: "Join or create poker games with friends and play online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <DataProvider>
        <html lang="en">
          <body className={`${inter.className} flex flex-col min-h-screen`}>
            <Header />
            <main className="flex-grow">
              <div className="container mx-auto px-4 py-8">
                <SignedOut>
                  <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                    <SignIn routing="hash" />
                  </div>
                </SignedOut>
                <SignedIn>
                  <div className="max-w-4xl mx-auto">
                    {children}
                  </div>
                  <Navigation />
                </SignedIn>
              </div>
            </main>
            <Footer />
          </body>
        </html>
      </DataProvider>
    </ClerkProvider>
  );
}