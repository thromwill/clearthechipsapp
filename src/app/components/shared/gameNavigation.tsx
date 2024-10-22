"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGlobalState } from "@/app/components/GlobalStateProvider";
import LeaveGame from "@/app/components/gameroom/leaveGame";

// Drilled function tells nav menu to close
interface GameNavigationProps {
  onNavigate: () => void;
}

const GameNavigation: React.FC<GameNavigationProps> = ({ onNavigate }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { getState } = useGlobalState();

  const context_game = getState("context_game");
  const isInGameRoom = pathname.includes("/gameroom/");


  const handleBackToGame = () => {
    onNavigate();
    router.push(`/gameroom/${context_game.join_code}`);
  };

  const handleHome = () => {
    onNavigate();
    router.push("/");
  };

  if (isInGameRoom) {
    return <LeaveGame onLeave={onNavigate} />;
  } else if (context_game?.join_code) {
    return (
      <button
        onClick={handleBackToGame}
        className="text-gray-600 hover:text-gray-900 transition-colors"
      >
        Back to Game
      </button>
    );
  } else {
    return (
      <button
        onClick={handleHome}
        className="text-gray-600 hover:text-gray-900 transition-colors"
      >
        Home
      </button>
    );
  }
};

export default GameNavigation;
