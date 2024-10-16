"use client";

import React, { useState } from "react";
import Image from "next/image";
import moneyIcon from "@/public/images/money_icon.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createOrUpdatePlay, getPlaysByGameId } from '@/lib/api/plays';
import { updatePlayerInGame } from '@/lib/api/game';
import { useGlobalState } from "@/app/components/GlobalStateProvider";

export default function BuyChips() {
  const [enteredAmount, setEnteredAmount] = useState<string>("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { getState } = useGlobalState();

  const handleBuyChipsEnter = async () => {
    const amount = parseInt(enteredAmount, 10);
    if (amount >= 1 && amount <= 10000) {
      try {
        const player = getState("player");
        if (!player) {
          throw new Error("Player not found");
        }

        const currentGame = getState("currentGame");
        const gameId = currentGame.game_id;

        // Get the current play data
        const plays = await getPlaysByGameId(gameId);
        const currentPlay = plays.find(play => play.player_id === player.player_id);

        // Calculate the new buyin amount
        const totalBuyin = (currentPlay?.buyin || 0) + amount;

        await createOrUpdatePlay({
          player_id: player.player_id,
          game_id: gameId,
          buyin: totalBuyin,
          is_cashed_out: false
        });

        // Update the player in the game and add the message
        await updatePlayerInGame(gameId, player.player_id, { buyin: totalBuyin }, amount);

        setEnteredAmount("");
        setOpen(false);
        toast({
          title: "Success",
          description: `You've purchased $${amount} in chips.`,
        });
      } catch (error) {
        console.error("Error buying chips:", error);
        toast({
          title: "Error",
          description: "Failed to buy chips. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid amount between $1 and $10,000.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (/^\d+$/.test(value) && parseInt(value, 10) <= 10000)) {
      setEnteredAmount(value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center justify-between w-36 h-8 outline outline-1 outline-gray-200 bg-white rounded-full px-2 mb-2">
          <Image src={moneyIcon} alt="Money" width={20} height={20} />
          <span className="text-sm text-dark-text font-semibold">
            Buy Chips
          </span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buy Chips</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="buy-in-amount">Enter buy-in amount</Label>
            <Input
              id="buy-in-amount"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Value in whole dollars $1-$10,000"
              value={enteredAmount}
              onChange={handleInputChange}
              aria-describedby="buy-in-amount-description"
            />
          </div>
          <Button onClick={handleBuyChipsEnter}>Enter</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}