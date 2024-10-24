"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { useOnboarding } from './OnboardingContext'

export default function VenmoConnect() {
  const { setCurrentStep } = useOnboarding()

  const handleVenmoConnect = async () => {
    // TODO: Implement Venmo connection logic here
    console.log('Connecting to Venmo...')
    // After successful connection:
    setCurrentStep('avatar')
  }

  // Placeholder function for testing
  const handleSkipVenmo = () => {
    console.log('Skipping Venmo connection...')
    setCurrentStep('avatar')
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Connect to Venmo</CardTitle>
        <CardDescription>Link your Venmo account to enable easy transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Connecting your Venmo account allows for seamless payments and requests within the app.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleVenmoConnect}>Connect Venmo</Button>
        <Button variant="outline" onClick={handleSkipVenmo}>Skip for now</Button>
      </CardFooter>
    </Card>
  )
}