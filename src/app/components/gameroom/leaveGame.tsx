"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useGlobalState } from "@/app/components/GlobalStateProvider";
import { removePlayerFromGame, completeGame, getGameById } from "@/lib/api/game";
import { createTransaction } from "@/lib/api/transaction";
import { calculateTransactions } from "@/lib/calculate_transactions";
import { useToast } from "@/hooks/use-toast";

interface LeaveGameProps {
  onLeave: () => void;
}

const LeaveGame: React.FC<LeaveGameProps> = ({ onLeave }) => {
  const router = useRouter();
  const { getState, setState } = useGlobalState();
  const { toast } = useToast();

  const handleLeaveGame = async () => {
    const context_player = getState("context_player");
    const context_game = getState("context_game")
    const context_plays = getState("context_plays")
    
    if (!context_player || !context_game) {
      toast({
        title: "Error",
        description: "Unable to leave game. Missing game or player information.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Fetch the latest plays
      if (!context_plays || context_plays.length === 0) {
        console.error("Plays not in context")
        toast({
          title: "Error",
          description: "Plays not found. Contact support.",
          variant: "destructive",
        });

      }

      const currentPlay = context_plays.find((p) => p.player_id === context_player.player_id);
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
      const updatedGame = await getGameById(context_game.game_id);
      const isHost = context_player.player_id === updatedGame.host_id;

          // Add confirmation check before proceeding
      if (isHost) {
        const userConfirmed = window.confirm("Are you sure you want to end the game?");
        if (!userConfirmed) {
          return;
        }
      }
      
      const remainingPlayers = context_plays.filter(
        (p) => p.is_currently_playing && p.player_id !== context_player.player_id
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
      await removePlayerFromGame(context_game.game_id, context_player.player_id);

      // If host or last player, complete the game
      if (isHost || remainingPlayers.length === 0) {
        await completeGame(context_game.game_id);

        // Calculate final balances and create transactions
        const finalBalances = context_plays.reduce((acc, play) => {
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
      setState("context_game", null);
      setState("context_plays", null);
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
      className="text-gray-500 hover:text-gray-900 transition-colors"
      onClick={handleLeaveGame}
    >
      Leave Game
    </button>
  );
};

export default LeaveGame;
