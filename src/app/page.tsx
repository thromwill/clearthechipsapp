"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreateGame from "@/app/components/home/createGame";
import { useToast } from "@/hooks/use-toast";
import { useGlobalState } from "@/app/components/GlobalStateProvider";
import {
  getGameByJoinCode,
  getPlayersInGame,
  addPlayerToGame,
  updatePlayerInGame,
} from "@/lib/api/game";
  
export default function Home() {
  const [showCreateGame, setShowCreateGame] = useState(false);
  const [gamePin, setGamePin] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const { getState } = useGlobalState();

  // Redirect user to gameroom if they are in a game
  useEffect(() => {
    const currentGameJoinCode = getState("currentGameJoinCode");
    
    if (currentGameJoinCode) {
      router.push(`/gameroom/${currentGameJoinCode}`);
    }
  }, [getState]);
  
  const handleJoinGame = async () => {
    try {
      const game = await getGameByJoinCode(gamePin);
      const player = getState("player")
  
      // Check if player is authenticated
      if (!player) {
        toast({
          title: "Error",
          description: "User not authenticated.",
          variant: "destructive",
        });
        return;
      }
  
      const players = await getPlayersInGame(game.game_id);
      const existingPlayer = players.find((p) => p.player_id === player.player_id);
  
      // Check if game is full
      if (players.length >= 10 && !existingPlayer) {
        toast({
          title: "Error",
          description: "Game is full. Maximum 10 players allowed.",
          variant: "destructive",
        });
        return;
      }
  
      // Handle rejoining or joining as a new player
      if (existingPlayer) {
        if (existingPlayer.is_currently_playing) {
          toast({
            title: "Info",
            description: "You're already in this game.",
          });
        } else {
          await updatePlayerInGame(game.game_id, player.player_id, {
            is_currently_playing: true,
          });
        }
      } else {
        // Add new player to the game
        await addPlayerToGame(game.game_id, {
          player_id: player.player_id,
          org_id: getState("org_id") || "",
          first_name: getState("first_name") || "",
          last_name: getState("last_name") || "",
          avatar_id: "",
        });
      }
  
      // Redirect to game room on success
      router.push(`/gameroom/${game.join_code}`);
    } catch (error) {
      console.error("Failed to join game:", error);
  
      // Check if the error indicates an invalid game code
      if ((error as Error).message === "Game not found") {
        toast({
          title: "Error",
          description: "Invalid game code. Please check and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to join game. Please try again.",
          variant: "destructive",
        });
      }
    }
  };
  

  // Function to handle game pin input and only allow numeric input
  const handleGamePinInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = event.target.value;
    const filteredValue = inputValue.replace(/[^0-9]/g, "");
    setGamePin(filteredValue);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent>
          <div className="mt-6 space-y-2">
            <Input
              type="text"
              placeholder="Enter Game Pin"
              value={gamePin}
              onChange={handleGamePinInputChange}
              className="h-16 text-center text-lg"
              maxLength={5}
            />
            <Button className="w-full" onClick={handleJoinGame}>
              Join Game
            </Button>
          </div>
          <Button
            variant="link"
            className="text-xs w-full"
            onClick={() => setShowCreateGame(true)}
          >
            Create Game
          </Button>
        </CardContent>
      </Card>
      <CreateGame open={showCreateGame} onOpenChange={setShowCreateGame} />
    </div>
  );
}
