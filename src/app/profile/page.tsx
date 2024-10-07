"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ChipCases from "@/app/components/chipCases/chipCases";
import { Game } from "@/lib/types";

// This would eventually come from the backend
const initialStats = [
  { label: "Games Played", value: "120" },
  { label: "Win Rate", value: "58%" },
  { label: "Total Winnings", value: "$1,500" },
  { label: "Highest Win", value: "$600" },
];

// Example recent games data (could come from backend)
const initialRecentGames: Game[] = [
  { game_id: "001", game_name: "Poker Night 1", completed: "2023-09-15" },
  { game_id: "002", game_name: "Poker Night 2", completed: "2023-09-18" },
  { game_id: "003", game_name: "Friday Poker", completed: "2023-09-20" },
];

export default function Profile() {
  const [stats, setStats] = useState(initialStats);
  const [recentGames, setRecentGames] = useState<Game[]>(initialRecentGames);

  return (
    <main className="min-h-screen overflow-auto p-4 md:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <section>
          <h2 className="mb-4 text-2xl font-bold">Chip Cases</h2>
          <ChipCases />
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">Statistics</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        <section>
          <h2 className="mb-4 text-2xl font-bold">Recent Activity</h2>
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {recentGames.map((game) => (
                  <li key={game.game_id} className="p-4">
                    <p className="font-medium">{game.game_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Played on {new Date(game.completed || "").toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
