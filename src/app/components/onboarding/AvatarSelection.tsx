"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useOnboarding } from "./OnboardingContext"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"

const avatars = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
]

export default function AvatarSelection() {
  const { setOnboardingComplete } = useOnboarding()
  const { user } = useUser()
  const [selectedAvatar, setSelectedAvatar] = useState("")

  const handleAvatarSelect = async () => {
    if (!selectedAvatar) return

    try {
      await user?.update({
        publicMetadata: {
          avatar: selectedAvatar,
          onboardingComplete: true,
        },
      })
      setOnboardingComplete(true)
    } catch (error) {
      console.error("Failed to update user avatar:", error)
    }
  }

  // Placeholder function for testing
  const handleSkipAvatar = () => {
    console.log('Skipping avatar selection...')
    setOnboardingComplete(true)
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Choose Your Avatar</CardTitle>
        <CardDescription>Select an avatar to represent you in the app</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {avatars.map((avatar, index) => (
            <div key={index} className="relative w-20 h-20">
              <Image
                src={avatar}
                alt={`Avatar ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className={`cursor-pointer rounded-full ${
                  selectedAvatar === avatar ? "border-4 border-primary" : ""
                }`}
                onClick={() => setSelectedAvatar(avatar)}
              />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleAvatarSelect} disabled={!selectedAvatar}>Confirm Avatar</Button>
        <Button variant="outline" onClick={handleSkipAvatar}>Skip for now</Button>
      </CardFooter>
    </Card>
  )
}