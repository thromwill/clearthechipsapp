import React, { useState } from "react";
import ChipInputDialog from "@/app/components/chipCases/chipInputDialog";
import { Button } from "@/components/ui/button";
import { useGlobalState } from "@/app/components/GlobalStateProvider";
import { createOrUpdatePlay } from "@/lib/api/plays";
import { useToast } from "@/hooks/use-toast";

const CashoutComponent: React.FC = () => {
  const [cashoutDialogOpen, setCashoutDialogOpen] = useState(false);
  const { getState } = useGlobalState();
  const { toast } = useToast();

  const handleCashout = async (chips: Record<string, number>) => {
    const context_game = getState("context_game");
    const context_player = getState("context_player");
    const context_plays = getState("context_plays");

    // Check if all required data is present
    if (!context_game || !context_player  || !context_plays) {
      console.error("Game, player, or plays data not found in the global state.");
      toast({
        title: "Error",
        description: "Game or player information not found. Please try reloading the page.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Ensure chip values are present in the game data
      if (!context_game.chip_values || Object.keys(context_game.chip_values).length === 0) {
        console.error("Chip values are missing or invalid")
        toast({
          title: "Error",
          description: "Error with chip values. Please contact support.",
          variant: "destructive",
        });
        return
      }

      // Find the player's play entry in the current game
      const currentPlay = context_plays.find(play => play.player_id === context_player .player_id);
      if (!currentPlay) {
        console.error(`Play entry not found for player_id: ${context_player .player_id}`);
        toast({
          title: "Error",
          description: "Error finding your game entry. Please contact support.",
          variant: "destructive",
        });
        return;
      }

      // Check if the player is currently playing
      if (!currentPlay.is_currently_playing) {
        console.error(`Player is not currently playing in game_id: ${context_game.game_id}`);
        toast({
          title: "Error",
          description: "You are not currently playing in this game.",
          variant: "destructive",
        });
        return;
      }

      // Check if the player is already cashed out
      if (currentPlay.is_cashed_out) {
        console.error(`Player is already cashed out`);
        toast({
          title: "Error",
          description: "Buy in before cashing out",
          variant: "destructive",
        });
        return;
      }

      // Calculate the total cashout amount based on the chip values provided
      const cashout = Object.entries(chips).reduce((sum, [color, quantity]) => {
        const chipValue = context_game.chip_values[color];
        if (chipValue === undefined) {
          throw new Error(`Chip value not found for color: ${color}`);
        }
        return sum + quantity * chipValue;
      }, 0);

      if (cashout <= 0) {
        toast({
          title: "Error",
          description: "Cashout amount must be greater than $0.",
          variant: "destructive",
        });
        return;
      }

      // Calculate the new total cashout, adding to any previous cashout value
      const totalCashout = (currentPlay.cashout || 0) + cashout;

      // Prepare play data for the update
      const playData = {
        player_id: context_player .player_id,
        game_id: context_game.game_id,
        cashout: totalCashout,
        current_buyin: 0,
        is_cashed_out: true,
      };

      // Update the play data with the new cashout value and flag as cashed out
      await createOrUpdatePlay(playData, cashout);

      // Notify the user of successful cashout
      toast({
        title: "Success",
        description: `You've successfully cashed out $${cashout.toFixed(2)}.`,
      });

    } catch (error) {
      console.error("Error during cashout process:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while processing the cashout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Button
        type="button"
        onClick={() => setCashoutDialogOpen(true)}
        className="p-0 text-blue-600 text-xs bg-transparent hover:underline"
        variant="link"
      >
        Cash Out
      </Button>

      <ChipInputDialog
        open={cashoutDialogOpen}
        onOpenChange={setCashoutDialogOpen}
        mode="cashout"
        chipCase={null}
        onSubmit={handleCashout}
      />
    </div>
  );
};

export default CashoutComponent;