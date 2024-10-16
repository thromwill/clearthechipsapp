"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useGlobalState } from "./GlobalStateProvider";
import { generateUUID } from "@/lib/utils";
import { getPlayerById, createOrUpdatePlayer } from "@/lib/api/player";
import { getPlaysByPlayerId } from "@/lib/api/plays";
import { Player } from "@/lib/types";

export default function InitializeUserData() {
  const { user } = useUser();
  const { setState, getState } = useGlobalState();

  useEffect(() => {
    const initializePlayerData = async () => {
      // Proceed only if user is available and player_id is not set
      if (!user){
        console.error("No authenticated user");
        return
      }

      if (!getState("player")) {
        let player: Partial<Player>;

        try {
          player = await getPlayerById(user.id);

          // Set player data in the global state
          setState("player", player);
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
          setState("player", player);

          // Persist new player data to the database
          await createOrUpdatePlayer(player);
        }

        // Check if the player is currently playing a game after player data is set
        const plays = await getPlaysByPlayerId(player.player_id!);

        const currentlyPlaying = plays.some(play => play.is_currently_playing);

        if (!currentlyPlaying) {
          // If not currently playing, set these states to null
          setState("currentGame", null);
          setState("currentPlays", null);
          setState("currentGameJoinCode", null);
        }
      }
    };

    initializePlayerData();
  }, [user]);

  return null; // This component doesn't render anything
}
