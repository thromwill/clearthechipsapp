"use client";

import React from "react";
import { useOnboarding } from "./OnboardingContext";
import VenmoConnect from "./VenmoConnect";
import AvatarSelection from "./AvatarSelection";
import Header from "../shared/header";

export default function OnboardingFlow({ children }: { children: React.ReactNode }) {
  const { isOnboardingComplete, currentStep } = useOnboarding();

  // If onboarding is complete, show the normal flow with the header
  if (isOnboardingComplete) {
    return (
      <>
        <Header />
        {children}
      </>
    );
  }

  // Onboarding flow: hide the header and center the steps on screen
  const renderOnboardingStep = () => {
    switch (currentStep) {
      case "venmo":
        return <VenmoConnect />;
      case "avatar":
        return <AvatarSelection />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      {renderOnboardingStep()}
    </div>
  );
}
