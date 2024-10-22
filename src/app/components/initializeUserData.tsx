"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useGlobalState } from "./GlobalStateProvider";
import { generateUUID } from "@/lib/utils";
import { getPlayerById, createOrUpdatePlayer } from "@/lib/api/player";
import { getPlaysByPlayerId } from "@/lib/api/plays";
import { Player } from "@/lib/types";

export default function InitializeUserData() {
  const { user, isLoaded } = useUser();
  const { setState, getState } = useGlobalState();

  useEffect(() => {
    const initializePlayerData = async () => {
      if (!getState("context_player")) {
        if (!isLoaded) {
          return;
        }
  
        if (!user){
          console.error("No authenticated user");
          return
        }

        let player: Partial<Player>;

        try {
          player = await getPlayerById(user.id);

          // Set player data in the global state
          setState("context_player", player);
        } catch (error) {
          console.error("Failed to fetch player data:", error);

          // Create new player data if fetching fails
          player = {
            player_id: generateUUID(),
            org_id: user.id,
            first_name: user.firstName || "",
            last_name: user.lastName || "",
            email: user.primaryEmailAddress?.emailAddress || "",
          };

          // Set new player data in the global state
          setState("context_player", player);

          // Persist new player data to the database
          await createOrUpdatePlayer(player);
        }

        // Check if the player is currently playing a game after player data is set
        const plays = await getPlaysByPlayerId(player.player_id!);

        const currentlyPlaying = plays.some(play => play.is_currently_playing);

        if (!currentlyPlaying) {
          // If not currently playing, set these states to null
          setState("context_game", null);
          setState("context_plays", null);
        }
      }
    };

    initializePlayerData();
  }, [user, isLoaded, getState, setState]);

  return null; // This component doesn't render anything
}
