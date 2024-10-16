"use client"

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import BuyChips from "@/app/components/gameroom/buyChips";
import ChipValues from "@/app/components/gameroom/chipValues";
import PlayerCarousel from "@/app/components/gameroom/playerCarousel";
import Logo from "@/public/images/logo.png";
import { Game, Play } from "@/lib/types";
import Cashout from "@/app/components/gameroom/cashout";
import { subscribeToGame, getGameByJoinCode, addPlayerToGame } from "@/lib/api/game";
import { getPlaysByGameId, subscribeToPlays } from "@/lib/api/plays";
import { useToast } from "@/hooks/use-toast";
import { useGlobalState } from "@/app/components/GlobalStateProvider";
import { ScrollArea } from "@/components/ui/scroll-area";

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

const GameRoom: React.FC<GameRoomProps> = ({ params }) => {
  const [game, setGame] = useState<Game | null>(null);
  const [plays, setPlays] = useState<Play[]>([]);
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const [buyInAmount, setBuyInAmount] = useState<number>(0);

  const { toast } = useToast();
  const { getState, setState } = useGlobalState();

  const chipValues = game?.chip_values;
  const joinCode = params.id;
  const player = getState("player");

  const messageAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollIntoView(false);
    }
  };

  useEffect(() => {
    fetchGameData();
    scrollToBottom();

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
    scrollToBottom();
  }, [messages]);

  const fetchGameData = async () => {
    try {
      const gameData = await getGameByJoinCode(joinCode);
      if (gameData) {
        setGame(gameData);
        setState("currentGame", gameData);

        const playerData = await getPlaysByGameId(gameData.game_id);
        setPlays(playerData);
        setState("currentPlays", playerData);

        const parsedMessages = parseMessages(gameData.messages);
        setMessages(parsedMessages);

        const currentPlayerPlay = playerData.find((play) => play.player_id === player.player_id);
        if (currentPlayerPlay) {
          setBuyInAmount(currentPlayerPlay.buyin || 0);
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
    } else if (typeof messages === 'string') {
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

    const updatedMessages = parseMessages(updatedGame.messages);
    setMessages(updatedMessages);
  };

  const handlePlaysUpdate = async (payload: any) => {
    const updatedPlay = payload.new as Play;
    const playerData = await getPlaysByGameId(game?.game_id || "");
    setPlays(playerData);

    if (updatedPlay.player_id === player.player_id) {
      setBuyInAmount(updatedPlay.buyin || 0);
    }
  };

  const renderMessage = (message: GameMessage) => (
    <div key={message.timestamp} className="py-1">
      <span className="text-sm">
        <span className="text-xs text-gray-500 mr-2">
        {new Date(message.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
        </span>
        {message.content}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen p-2 md:p-6 lg:p-8">
      <div className="flex flex-col container mx-auto max-w-4xl space-y-6">
        <header className="flex sm:flex-row justify-between items-center gap-4">
          <ChipValues chipValues={chipValues} />
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold">{game?.join_code || "Loading..."}</p>
          </div>
        </header>

        <h1 className="text-2xl md:text-3xl font-bold text-center">{game?.game_name || "Loading..."}</h1>

        <div className="max-w-fit">
          <PlayerCarousel
            players={plays.filter((play) => play.is_currently_playing).map((play) => play.PLAYER)}
          />
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4">
            <Image src={Logo} alt="Logo" width={36} height={36} />
            <div>
              <p className="text-sm text-muted-foreground">Bought in for</p>
              <p className="text-xl font-semibold">${buyInAmount.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-2 mt-4">
            <BuyChips />
            <Cashout />
          </div>
        </div>

        <ScrollArea className="h-32 border rounded-md p-2" ref={messageAreaRef}>
          {messages.map(renderMessage)}
        </ScrollArea>
      </div>
    </div>
  );
};

export default GameRoom;