import React from "react";
import Image from "next/image";
import BuyChips from "./buyChips";
import ChipValues from "./chipValues";
import Cashout from "./cashOut";
import PlayerCarousel from "./playerCarousel";
import Logo from "@/public/images/logo.png";

type Player = {
  id: number;
  name: string;
  avatarPath: string;
};

const players: Player[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  avatarPath: `/images/avatars/${i}.png`,
  name: `Player ${i + 1}`,
}));

export default function GameRoom() {
  return (
    <div className="min-h-screen p-2 md:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-6">
        <header className="flex sm:flex-row justify-between items-center gap-4">
          <ChipValues
            chipValues={{
              red: 5,
              blue: 10,
              green: 25,
              black: 100,
            }}
          />
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold">12345</p>
          </div>
        </header>

        <h1 className="text-2xl md:text-3xl font-bold text-center">
          Will&apos;s Poker Game
        </h1>

        <div className="">
          <PlayerCarousel players={players} />
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4">
            <Image src={Logo} alt="Logo" width={36} height={36} />
            <div>
              <p className="text-sm text-muted-foreground">Bought in for</p>
              <p className="text-xl font-semibold">$5.00</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center">
            <BuyChips />
            <Cashout />
          </div>
        </div>
        
        <p className="text-sm">Drew joined the game!</p>
      </div>
    </div>
  );
}
