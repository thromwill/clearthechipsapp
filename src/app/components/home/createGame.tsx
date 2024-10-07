// components/CreateGameDialog.tsx

"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type CreateGameDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const CreateGameDialog: React.FC<CreateGameDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [gameName, setGameName] = useState("");
  const [stakes, setStakes] = useState("");

  const handleCreateGame = () => {
    console.log("Creating game:", { gameName, stakes });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Game</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Game Name"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
          />
          <Select value={stakes} onValueChange={setStakes}>
            <SelectTrigger>
              <SelectValue placeholder="Select Stakes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.01/0.02">$0.01 / $0.02</SelectItem>
              <SelectItem value="0.02/0.05">$0.02 / $0.05</SelectItem>
              <SelectItem value="0.05/0.10">$0.05 / $0.10</SelectItem>
              <SelectItem value="0.10/0.20">$0.10 / $0.20</SelectItem>
              <SelectItem value="0.25/0.50">$0.25 / $0.50</SelectItem>
              <SelectItem value="0.50/1.00">$0.50 / $1.00</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={handleCreateGame}>Create Game</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGameDialog;
