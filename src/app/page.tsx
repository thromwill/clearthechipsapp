"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreateGame from "@/app/components/home/createGame";
import { motion } from "framer-motion";

export default function Home() {
  const [showCreateGame, setShowCreateGame] = useState(false);
  const [gamePin, setGamePin] = useState("");

  // call join game api
  const handleJoinGame = () => {
    console.log("Joining game with pin:", gamePin);
  };

  const handleGamePinInputChange = (event) => {
    const inputValue = event.target.value;
    const filteredValue = inputValue.replace(/[^0-9]/g, "");
    setGamePin(filteredValue);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-lg">
          <CardContent>
            <div className=" mt-6 space-y-2">
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
              Create New Game
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <CreateGame open={showCreateGame} onOpenChange={setShowCreateGame} />
    </div>
  );
}
