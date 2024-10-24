"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import BuyChips from "@/app/components/gameroom/buyChips";
import ChipValues from "@/app/components/gameroom/chipValues";
import PlayerCarousel from "@/app/components/gameroom/playerCarousel";
import Logo from "@/public/images/logo.png";
import { Game, Play } from "@/lib/types";
import Cashout from "@/app/components/gameroom/cashout";
import { subscribeToGame, getGameByJoinCode } from "@/lib/api/game";
import { getPlaysByGameId, subscribeToPlays } from "@/lib/api/plays";
import { useToast } from "@/hooks/use-toast";
import { useGlobalState } from "@/app/components/GlobalStateProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import PlayerList from "@/app/components/gameroom/playerList";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Coins } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface GameRoomProps {
  params: { id: string };
}

interface GameMessage {
  user_id: string;
  first_name: string;
  last_name: string;
  timestamp: number;
  content: string;
}

export default function GameRoom({ params }: GameRoomProps) {
  const [game, setGame] = useState<Game | null>(null);
  const [plays, setPlays] = useState<Play[]>([]);
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const [currentBuyIn, setCurrentBuyIn] = useState<number>(0);

  const { toast } = useToast();
  const { getState, setState } = useGlobalState();

  const chipValues = game?.chip_values;
  const joinCode = params.id;
  const context_player = getState("context_player");

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (context_player) {
      fetchGameData();
    }
  }, [context_player]);

  useEffect(() => {
    let gameSubscription: { unsubscribe: () => void } | null = null;
    let playsSubscription: { unsubscribe: () => void } | null = null;

    if (game?.game_id) {
      gameSubscription = subscribeToGame(game.game_id, handleGameUpdate);
      playsSubscription = subscribeToPlays(game.game_id, handlePlaysUpdate);
    }

    return () => {
      gameSubscription?.unsubscribe();
      playsSubscription?.unsubscribe();
    };
  }, [game?.game_id]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages]);

  const fetchGameData = async () => {
    try {
      const gameData = await getGameByJoinCode(joinCode);
      if (gameData) {
        setGame(gameData);
        setState("context_game", gameData);

        const playerData = await getPlaysByGameId(gameData.game_id);
        setPlays(playerData);
        setState("context_plays", playerData);

        const parsedMessages = parseMessages(gameData.messages);
        setMessages(parsedMessages);

        const currentPlayerPlay = playerData.find(
          (play) => play.player_id === context_player.player_id
        );
        if (currentPlayerPlay) {
          setCurrentBuyIn(currentPlayerPlay.current_buyin || 0);
        }
      }
    } catch (error) {
      console.error("Failed to fetch game data:", error);
      toast({
        title: "Error",
        description: "Failed to load game data.",
        variant: "destructive",
      });
    }
  };

  const parseMessages = (messages: any): GameMessage[] => {
    if (Array.isArray(messages)) {
      return messages;
    } else if (typeof messages === "string") {
      try {
        const parsed = JSON.parse(messages);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error("Error parsing messages:", error);
        return [];
      }
    }
    console.error("Unexpected messages format:", messages);
    return [];
  };

  const handleGameUpdate = (payload: any) => {
    const updatedGame = payload.new as Game;
    setGame(updatedGame);
    setState("context_game", updatedGame);

    const updatedMessages = parseMessages(updatedGame.messages);
    setMessages(updatedMessages);
  };

  const handlePlaysUpdate = async (payload: any) => {
    const updatedPlay = payload.new as Play;
    const playerData = await getPlaysByGameId(game?.game_id || "");
    setPlays(playerData);
    setState("context_plays", playerData);

    if (updatedPlay.player_id === context_player.player_id) {
      setCurrentBuyIn(updatedPlay.current_buyin || 0);
    }
  };

  const renderMessage = (message: GameMessage) => (
    <div
      key={message.timestamp}
      className="py-1 border-b border-border last:border-b-0"
    >
      <div className="flex space-x-2 items-center">
        <span className="text-xs text-muted-foreground">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })}
        </span>
        <p className="text-xs">{message.content}</p>
      </div>
    </div>
  );

  const moneyInTheGame = plays.reduce(
    (sum, play) => sum + (play.buyin || 0),
    0
  );
  const moneyOnTable = plays.reduce(
    (sum, play) => sum + ((play.buyin || 0) - (play.cashout || 0)),
    0
  );

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="space-y-4 max-w-md mx-auto">
        <div className="flex justify-between">
          <div className="flex flex-col items-start">
            <h1 className="text-xl font-bold">
              {game?.game_name || "Loading..."}
            </h1>
            <div className="text-gray text-xs">
              {game?.join_code || "Loading..."}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Users className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Players</DialogTitle>
                </DialogHeader>
                <PlayerList plays={plays} />
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Coins className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Chip Values</DialogTitle>
                </DialogHeader>
                <ChipValues
                  chipValues={chipValues}
                  moneyInTheGame={moneyInTheGame}
                  moneyOnTable={moneyOnTable}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <PlayerCarousel
          players={plays
            .filter((play) => play.is_currently_playing)
            .map((play) => play.PLAYER)}
        />

        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-4">
            <Image src={Logo} alt="Logo" width={36} height={36} />
            <div>
              <p className="text-xs text-muted-foreground">Bought In For</p>
              <p className="text-lg font-semibold">
                ${currentBuyIn.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="flex flex-col space-x-2">
            <BuyChips />
            <Cashout />
          </div>
        </div>

        <ScrollArea className="h-24 w-full">
          <div className="space-y-2">
            {messages.map(renderMessage)}
            <div ref={messageEndRef} />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
