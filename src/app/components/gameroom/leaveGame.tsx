"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useGlobalState } from "@/app/components/GlobalStateProvider";
import { removePlayerFromGame, completeGame, getGameById } from "@/lib/api/game";
import { createTransaction } from "@/lib/api/transaction";
import { getPlaysByGameId } from "@/lib/api/plays";
import { calculateTransactions } from "@/lib/calculate_transactions";
import { useToast } from "@/hooks/use-toast";
import { Game } from "@/lib/types";

interface LeaveGameProps {
  onLeave: () => void;
}

const LeaveGame: React.FC<LeaveGameProps> = ({ onLeave }) => {
  const router = useRouter();
  const { getState, setState } = useGlobalState();
  const { toast } = useToast();

  const handleLeaveGame = async () => {
    const player = getState("player");
    const game = getState("currentGame") as Game | null;

    if (!player || !game) {
      toast({
        title: "Error",
        description: "Unable to leave game. Missing game or player information.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Fetch the latest plays
      const plays = await getPlaysByGameId(game.game_id);
      if (!plays || plays.length === 0) {
        throw new Error("No plays found for the game.");
      }

      const currentPlay = plays.find((p) => p.player_id === player.player_id);
      if (!currentPlay) {
        toast({
          title: "Error",
          description: "You are not part of this game.",
          variant: "destructive",
        });
        return;
      }

      if (!currentPlay.is_cashed_out) {
        toast({
          title: "Error",
          description: "You must cash out before leaving the game.",
          variant: "destructive",
        });
        return;
      }

      // Check if the player is the host and if there are remaining players
      const updatedGame = await getGameById(game.game_id);
      const isHost = player.player_id === updatedGame.host_id;
      const remainingPlayers = plays.filter(
        (p) => p.is_currently_playing && p.player_id !== player.player_id
      );

      if (isHost && remainingPlayers.length > 0) {
        toast({
          title: "Error",
          description: "As the host, you must be the last player to leave the game.",
          variant: "destructive",
        });
        return;
      }

      // Remove player from the game
      await removePlayerFromGame(game.game_id, player.player_id);

      // If host or last player, complete the game
      if (isHost || remainingPlayers.length === 0) {
        await completeGame(game.game_id);

        // Calculate final balances and create transactions
        const finalBalances = plays.reduce((acc, play) => {
          acc[play.player_id] =
            (play.cashout || 0) - (play.buyin || 0);
          return acc;
        }, {} as Record<string, number>);

        const transactions = calculateTransactions(finalBalances);

        for (const tx of transactions) {
          await createTransaction({
            by_id: tx.by,
            for_id: tx.for,
            amount: tx.amount,
          });
        }

        toast({
          title: "Game Completed",
          description:
            "The game has been completed, and transactions have been recorded.",
        });
      }

      // Clear game state and redirect to the home page
      
      setState("currentGame", null);
      setState("currentPlays", null);
      setState("currentGameJoinCode", null);
      onLeave();
      router.push("/");
    } catch (error) {
      console.error("Failed to leave game:", error);
      toast({
        title: "Error",
        description: "Failed to leave game. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <button
      className="text-gray-600 hover:text-gray-900 transition-colors"
      onClick={handleLeaveGame}
    >
      Leave Game
    </button>
  );
};

export default LeaveGame;
