import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";
import Navigation from "./components/shared/navigation";
import Header from "./components/shared/header";
import Footer from "./components/shared/footer";
import { ThemeProvider } from "./components/theme-provider";
import { GlobalStateProvider } from "./components/GlobalStateProvider";
import InitializeUserData from "@/app/components/initializeUserData";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clear The Chips - Online Poker",
  description: "Join or create poker games with friends and play online.",
};

function AuthenticatedApp({ children }: { children: React.ReactNode }) {
  return (
    <GlobalStateProvider>
      <InitializeUserData />
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} flex flex-col min-h-screen`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="min-h-screen flex-grow">
              <div className="container mx-auto px-4 py-8">{children}</div>
            </main>
            {/* <Navigation />
            <Footer /> */}
          </ThemeProvider>
        </body>
      </html>
    </GlobalStateProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <SignedIn>
        <AuthenticatedApp>{children}</AuthenticatedApp>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  );
}
