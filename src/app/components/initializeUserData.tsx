"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useGlobalState } from "./GlobalStateProvider";
import { generateUUID } from "@/lib/utils";
import { getPlayerById } from "@/lib/api/player";
import { createOrUpdatePlayer } from "@/lib/api/player";
import { Player } from "@/lib/types";

export default function InitializeUserData() {
  const { user } = useUser();
  const { setState, getState } = useGlobalState();

  useEffect(() => {
    const checkAndCreatePlayer = async () => {
      if (user && !getState("player_id")) {
        try {
          const player = await getPlayerById(user.id);
          setState("player_id", player.player_id);
          setState("org_id", player.org_id);
          setState("first_name", player.first_name);
          setState("last_name", player.last_name);
          setState("email", player.email);
        } catch (error) {
          const playerData: Partial<Player> = {
            player_id: generateUUID(),
            org_id: user.id,
            first_name: user.firstName ?? "",
            last_name: user.lastName ?? "",
            email: user.primaryEmailAddress?.emailAddress ?? "",
          };

          setState("player_id", playerData.player_id);
          setState("org_id", playerData.org_id);
          setState("first_name", playerData.first_name);
          setState("last_name", playerData.last_name);
          setState("email", playerData.email);

          await createOrUpdatePlayer(playerData);
        }
      }
    };

    checkAndCreatePlayer();
  }, [user, setState, getState]);

  return null; // This component doesn't render anything
}
