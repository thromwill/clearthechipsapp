import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import Footer from "./components/shared/footer";
import { ThemeProvider } from "./components/theme-provider";
import { GlobalStateProvider } from "./components/GlobalStateProvider";
import InitializeUserData from "@/app/components/initializeUserData";
import { Toaster } from "@/components/ui/toaster";
import { OnboardingProvider } from "@/app/components/onboarding/OnboardingContext";
import OnboardingFlow from "@/app/components/onboarding/OnboardingFlow";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clear The Chips",
  description: "Easily manage your home poker game.",
};

function AuthenticatedApp({ children }: { children: React.ReactNode }) {
  return (
    <GlobalStateProvider>
      <OnboardingProvider>
        <InitializeUserData />
        <html lang="en" suppressHydrationWarning>
          <body className={`${inter.className} flex flex-col min-h-screen relative`}>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              {/* The header is in the OnboardingFlow */}
              <OnboardingFlow>{children}</OnboardingFlow>
              <Footer />
            </ThemeProvider>
            <Toaster />
          </body>
        </html>
      </OnboardingProvider>
    </GlobalStateProvider>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
