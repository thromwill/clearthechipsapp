"use client"

import React from 'react'
import { useOnboarding } from './OnboardingContext'
import VenmoConnect from "./VenmoConnect"
import AvatarSelection from "./AvatarSelection"

export default function OnboardingFlow({ children }: { children: React.ReactNode }) {
  const { isOnboardingComplete, currentStep } = useOnboarding()

  if (isOnboardingComplete) {
    return <>{children}</>
  }

  switch (currentStep) {
    case 'venmo':
      return <VenmoConnect />
    case 'avatar':
      return <AvatarSelection />
    default:
      return <>{children}</>
  }
}