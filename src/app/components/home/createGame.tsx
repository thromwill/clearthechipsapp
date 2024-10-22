"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ChipCases from "../chipCases/chipCases";
import { createGame, addPlayerToGame } from "@/lib/api/game";
import { getChipCaseById } from "@/lib/api/chipCase";
import { useToast } from "@/hooks/use-toast";
import { useGlobalState } from "../GlobalStateProvider";
import { assignChipValues } from "@/lib/assign_chip_values";

type CreateGameDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const CreateGameDialog: React.FC<CreateGameDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [gameName, setGameName] = useState("");
  const [stakes, setStakes] = useState("");
  const [selectedChipCaseId, setSelectedChipCaseId] = useState<string | null>(
    null
  );
  const router = useRouter();
  const { getState } = useGlobalState();
  const { toast } = useToast();

  const handleCreateGame = async () => {
    const context_player = getState("context_player")
    const game = getState("context_game")

    if (!context_player) {
      toast({
        title: "Error",
        description: "Failed to retrieve user data. Please log in.",
        variant: "destructive",
      });
      return;
    }

    if (game) {
      toast({
        title: "Error",
        description: "You are already in a game. Please exit your game before creating a new one.",
        variant: "destructive",
      });
      return;
    }

    if (!gameName || !stakes || !selectedChipCaseId) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get chip quantities of selected chip case
      const chipCase = await getChipCaseById(selectedChipCaseId);
      if (!chipCase.chips) {
        throw new Error("Selected chip case has no chips");
      }

      const bigBlind = parseFloat(stakes.split("/")[1]);
      const chipValues = assignChipValues(chipCase.chips, bigBlind, 9); // Assuming max 9 players

      if (!chipValues) {
        throw new Error("Failed to assign chip values");
      }

      const [assignedValues] = chipValues;

      const chipValuesObject = Object.fromEntries(
        Object.keys(chipCase.chips).map((color, index) => [
          color,
          assignedValues[index],
        ])
      );

      const newGame = await createGame({
        game_name: gameName,
        host_id: context_player.player_id,
        case_id: selectedChipCaseId,
        big_blind: bigBlind,
        chip_values: chipValuesObject,
      });

      await addPlayerToGame(newGame.game_id, {
        player_id: context_player.player_id,
        org_id: context_player.org_id,
        first_name: context_player.first_name,
        last_name: context_player.last_name,
        avatar_id: "",
      });

      toast({
        title: "Success",
        description: "Game created successfully!",
      });

      onOpenChange(false);
      router.push(`/gameroom/${newGame.join_code}`);
    } catch (error) {
      console.error("Failed to create game:", error);
      toast({
        title: "Error",
        description: "Failed to create game. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGameNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
  
    // Filter the input to allow only a-z, A-Z, and 0-9 characters
    const filteredValue = inputValue.replace(/[^a-zA-Z0-9 ]/g, "");
  
    // Ensure the name does not exceed 64 characters
    if (filteredValue.length <= 64) {
      setGameName(filteredValue);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Game</DialogTitle>
        </DialogHeader>
        <div className="container mx-auto max-w-80 space-y-4">
          <Input
            placeholder="Game Name"
            value={gameName}
            onChange={handleGameNameChange}
          />
          <Select value={stakes} onValueChange={setStakes}>
            <SelectTrigger>
              <SelectValue placeholder="Select Stakes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.01/0.02">$0.01 / $0.02</SelectItem>
              <SelectItem value="0.02/0.05">$0.02 / $0.05</SelectItem>
              <SelectItem value="0.05/0.10">$0.05 / $0.10</SelectItem>
              <SelectItem value="0.10/0.20">$0.10 / $0.20</SelectItem>
              <SelectItem value="0.25/0.50">$0.25 / $0.50</SelectItem>
              <SelectItem value="0.50/1.00">$0.50 / $1.00</SelectItem>
              <SelectItem value="0.50/1.00">$1.00 / $2.00</SelectItem>
            </SelectContent>
          </Select>
          <ChipCases onSelect={setSelectedChipCaseId} />
        </div>

        <DialogFooter>
          <Button onClick={handleCreateGame}>Create Game</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGameDialog;
