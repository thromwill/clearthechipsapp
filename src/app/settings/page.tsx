"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";

export default function Settings() {
  const [notificationsAll, setNotificationsAll] = useState(true);
  const [notificationsGame, setNotificationsGame] = useState(true);
  const [notificationsResults, setNotificationsResults] = useState(true);
  const [notificationsTransactions, setNotificationsTransactions] =
    useState(true);
  const [notificationsNews, setNotificationsNews] = useState(true);

  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen overflow-auto container mx-auto max-w-2xl p-4 space-y-8">
      <h1 className="mt-10 text-3xl font-bold">Settings</h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Notifications</h2>

        <div className="flex items-center justify-between">
          <Label htmlFor="notifications-all">Enable all notifications</Label>
          <Switch
            id="notifications-all"
            checked={notificationsAll}
            onCheckedChange={setNotificationsAll}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="notifications-game">Game invitations</Label>
          <Switch
            id="notifications-game"
            checked={notificationsGame}
            onCheckedChange={setNotificationsGame}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="notifications-results">Game results</Label>
          <Switch
            id="notifications-results"
            checked={notificationsResults}
            onCheckedChange={setNotificationsResults}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="notifications-transactions">Transactions</Label>
          <Switch
            id="notifications-transactions"
            checked={notificationsTransactions}
            onCheckedChange={setNotificationsTransactions}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="notifications-news">News and updates</Label>
          <Switch
            id="notifications-news"
            checked={notificationsNews}
            onCheckedChange={setNotificationsNews}
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
    </div>
  );
}
