import React, { useState } from "react";
import ChipInputDialog from "@/app/components/chipCases/chipInputDialog";
import { Button } from "@/components/ui/button";
import { useGlobalState } from "@/app/components/GlobalStateProvider";
import { createOrUpdatePlay, getPlaysByGameId } from "@/lib/api/plays";
import { updatePlayerInGame } from "@/lib/api/game";
import { useToast } from "@/hooks/use-toast";

const CashoutComponent: React.FC = () => {
  const [cashoutDialogOpen, setCashoutDialogOpen] = useState(false);
  const { getState } = useGlobalState();
  const { toast } = useToast();

  const handleCashout = async (chips: Record<string, number>) => {
    const game = getState("currentGame");
    const player = getState("player");

    // Early return if game or player ID is missing
    if (!game || !player) {
      toast({
        title: "Error",
        description: "Game or player information not found.",
        variant: "destructive",
      });
      return;
    }

    try {
      const plays = await getPlaysByGameId(game.game_id);
      if (!plays || plays.length === 0) {
        throw new Error("No plays found for the game.");
      }

      // Calculate the total cashout based on chip values
      const cashout = Object.entries(chips).reduce((sum, [color, quantity]) => {
        const chipValue = game.chip_values[color];
        if (chipValue === undefined) {
          throw new Error(`Chip value not found for color: ${color}`);
        }
        return sum + quantity * chipValue;
      }, 0);

      const currentPlay = plays.find(play => play.player_id === player.player_id);

      // Calculate new total cashout, adding to any previous cashout value
      const totalCashout = (currentPlay?.cashout || 0) + cashout;

      const playData = {
        player_id: player.player_id,
        game_id: game.game_id,
        cashout: totalCashout,
        is_cashed_out: true,
      };

      // Update the play data (cashout and flag)
      await createOrUpdatePlay(playData);

      // Update the player in the game and add the message
      await updatePlayerInGame(game.game_id, player.player_id, { cashout: totalCashout}, cashout);

      toast({
        title: "Success",
        description: `You've cashed out $${totalCashout.toFixed(2)}.`,
      });

    } catch (error) {
      console.error("Failed to cash out:", error);
      toast({
        title: "Error",
        description: "Failed to cash out. Please try again.",
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