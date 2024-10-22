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
import { createOrUpdatePlay } from '@/lib/api/plays';
import { useGlobalState } from "@/app/components/GlobalStateProvider";

const MAX_BUY_IN = 10000;

export default function BuyChips() {
  const [enteredAmount, setEnteredAmount] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { getState } = useGlobalState();

  const handleBuyChipsEnter = async () => {
    const amount = parseInt(enteredAmount, 10);

    if (isNaN(amount) || amount <= 0 || amount > MAX_BUY_IN) {
      toast({
        title: "Invalid Amount",
        description: `Please enter a valid amount between $1 and $${MAX_BUY_IN}.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const context_player = getState("context_player");
      const context_game = getState("context_game");
      const context_plays = getState("context_plays");

      if (!context_player || !context_game || !context_plays) {
        throw new Error("Required context not found");
      }

      const currentPlay = context_plays.find(play => play.player_id === context_player.player_id);

      if (!currentPlay || !currentPlay.is_currently_playing) {
        throw new Error("Player is not currently in the game");
      }

      const newTotalBuyin = (currentPlay.buyin || 0) + amount;
      const newCurrentBuyin = (currentPlay.current_buyin || 0) + amount;

      await createOrUpdatePlay({
        player_id: context_player.player_id,
        game_id: context_game.game_id,
        buyin: newTotalBuyin,
        current_buyin: newCurrentBuyin,
        is_cashed_out: false,
      }, amount);

      setEnteredAmount("");
      setOpen(false);

      toast({
        title: "Success",
        description: `You've purchased $${amount} in chips.`,
      });
    } catch (error) {
      console.error("Error during the buy-in process:", error);
      toast({
        title: "Error",
        description: "Failed to buy chips. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (/^\d+$/.test(value) && parseInt(value, 10) <= MAX_BUY_IN)) {
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
              placeholder={`Value in whole dollars $1-$${MAX_BUY_IN}`}
              value={enteredAmount}
              onChange={handleInputChange}
              aria-describedby="buy-in-amount-description"
            />
          </div>
          <Button onClick={handleBuyChipsEnter} disabled={isLoading}>
            {isLoading ? "Processing..." : "Enter"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}