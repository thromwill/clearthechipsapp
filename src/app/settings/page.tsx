"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function Settings() {
  const [notifications, setNotifications] = useState(true)
  const [volume, setVolume] = useState(50)
  const [theme, setTheme] = useState("dark")

  return (
    <div className="container mx-auto max-w-2xl p-4 space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications">Enable notifications</Label>
          <Switch
            id="notifications"
            checked={notifications}
            onCheckedChange={setNotifications}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Sound</h2>
        <div className="space-y-2">
          <Label htmlFor="volume">Volume</Label>
          <Slider
            id="volume"
            min={0}
            max={100}
            step={1}
            value={[volume]}
            onValueChange={(value) => setVolume(value[0])}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Appearance</h2>
        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger id="theme">
              <SelectValue placeholder="Select a theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Account</h2>
        <div className="flex space-x-4">
          <Button variant="outline">Change Password</Button>
          <Button variant="destructive">Delete Account</Button>
        </div>
      </div>

      <Separator />

      <Button className="w-full">Save Changes</Button>
    </div>
  )
}
