"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

interface OnboardingContextType {
  isOnboardingComplete: boolean
  setOnboardingComplete: (value: boolean) => void
  currentStep: 'venmo' | 'avatar' | 'complete'
  setCurrentStep: (step: 'venmo' | 'avatar' | 'complete') => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export const useOnboarding = () => {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser()
  const [isOnboardingComplete, setOnboardingComplete] = useState(false)
  const [currentStep, setCurrentStep] = useState<'venmo' | 'avatar' | 'complete'>('venmo')

  useEffect(() => {
    if (user) {
      // Check if user has completed onboarding
      const onboardingComplete = user.publicMetadata.onboardingComplete as boolean
      setOnboardingComplete(onboardingComplete || false)
      setCurrentStep(onboardingComplete ? 'complete' : 'venmo')
    }
  }, [user])

  return (
    <OnboardingContext.Provider value={{ isOnboardingComplete, setOnboardingComplete, currentStep, setCurrentStep }}>
      {children}
    </OnboardingContext.Provider>
  )
}