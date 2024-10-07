"use client";

import React, { useState } from "react";
import Image from "next/image";
import BuyChips from "@/app/components/gameroom/buyChips";
import ChipValues from "@/app/components/gameroom/chipValues";
import PlayerCarousel from "@/app/components/gameroom/playerCarousel";
import Logo from "@/public/images/logo.png";
import { Game, Player } from "@/lib/types";
import Cashout from "@/app/components/gameroom/cashout";

export default function GameRoom({ params }: { params: { id: string } }) {
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [chipValues, setChipValues] = useState<Record<string, number>>({
    red: 5,
    blue: 10,
    green: 25,
    black: 100,
  });
  const [joinCode, setJoinCode] = useState<string>("12345");
  const [gameTitle, setGameTitle] = useState<string>("Will's Poker Game");
  const [buyInAmount, setBuyInAmount] = useState<number>(0);
  const [playerMessages, setPlayerMessages] = useState<string>("Drew joined the game!");

  return (
    <div className="min-h-screen p-2 md:p-6 lg:p-8">
      <div className="flex flex-col container mx-auto max-w-4xl space-y-6">
        <header className="flex sm:flex-row justify-between items-center gap-4">
          <ChipValues
            chipValues={chipValues}
          />
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold">{joinCode}</p>
          </div>
        </header>

        <h1 className="text-2xl md:text-3xl font-bold text-center">
          {gameTitle}
        </h1>

        <div className="max-w-fit">
          <PlayerCarousel players={players} />
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4">
            <Image src={Logo} alt="Logo" width={36} height={36} />
            <div>
              <p className="text-sm text-muted-foreground">Bought in for</p>
              <p className="text-xl font-semibold">${buyInAmount}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-2 mt-4">
            <BuyChips />
            <Cashout />
          </div>
        </div>

        <div className="mt-4">
          <p>{playerMessages}</p>
        </div>
      </div>
    </div>
  );
}
