"use client";

import React, { useState, useEffect } from "react";
import ChipCaseCarousel from "@/app/components/chipCases/chipCaseCarousel";
import { Button } from "@/components/ui/button";
import {
  getChipCasesByPlayerId,
  createOrUpdateChipCase,
  removeChipCase,
} from "@/lib/api/chipCase";
import { ChipCase } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useGlobalState } from "@/app/components/GlobalStateProvider";
import ChipInputDialog from "@/app/components/chipCases/chipInputDialog";
import { generateUUID } from "@/lib/utils";
import { PlusCircle } from "lucide-react";

interface ChipCasesProps {
  onSelect?: (caseId: string) => void;
}

export default function ChipCases({ onSelect }: ChipCasesProps) {
  const { getState } = useGlobalState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chipInputDialogOpen, setChipInputDialogOpen] = useState(false);
  const [chipCases, setChipCases] = useState<ChipCase[]>([]);
  const [currentCase, setCurrentCase] = useState<ChipCase | null>(null);
  const [chipInputMode, setChipInputMode] = useState<"add" | "edit">("add");
  const { toast } = useToast();

  const player = getState("player");

  useEffect(() => {
    if (player.player_id) {
      fetchChipCases();
    }
  }, [player.player_id]);

  useEffect(() => {
    // Whenever the index changes, call onSelect with the current chip case ID
    if (onSelect && chipCases.length > 0) {
      setCurrentCase(chipCases[currentIndex])
      onSelect(chipCases[currentIndex].case_id);
    }

  }, [currentIndex, chipCases, onSelect]);

  const fetchChipCases = async () => {
    try {
      const cases = await getChipCasesByPlayerId(player.player_id);
      setChipCases(cases);
    } catch (error) {
      console.error("Failed to fetch chip cases:", error);
      toast({
        title: "Error",
        description: "Failed to fetch chip cases. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddChipCase = () => {
    if (chipCases.length < 12) {
      setCurrentCase(null);
      setChipInputMode("add");
      setChipInputDialogOpen(true);
    } else {
      toast({
        title: "Limit Reached",
        description: "You can't have more than 12 chip cases.",
        variant: "destructive",
      });
    }
  };

  const handleEditChipCase = (chipCase: ChipCase) => {
    setCurrentCase(chipCase);
    setChipInputMode("edit");
    setChipInputDialogOpen(true);
  };

  const handleChipInputSubmit = async (
    chips: { [color: string]: number },
    caseName: string
  ) => {
    try {
      const updatedCase = await createOrUpdateChipCase({
        case_id: currentCase?.case_id || generateUUID(),
        player_id: player.player_id,
        case_name: caseName,
        chips: chips,
      });

      if (currentCase) {
        setChipCases(
          chipCases.map((c) =>
            c.case_id === updatedCase.case_id ? updatedCase : c
          )
        );
      } else {
        setChipCases([...chipCases, updatedCase]);
      }

      toast({
        title: "Success",
        description: `Chip case ${
          currentCase ? "updated" : "added"
        } successfully.`,
      });
    } catch (error) {
      console.error("Failed to save chip case:", error);
      toast({
        title: "Error",
        description: `Failed to ${
          currentCase ? "update" : "add"
        } chip case. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleRemoveChipCase = async (chipCase: ChipCase) => {
    try {
      await removeChipCase(chipCase.case_id);
      setChipCases(chipCases.filter((c) => c.case_id !== chipCase.case_id));
      toast({
        title: "Success",
        description: "Chip case removed successfully.",
      });
    } catch (error) {
      console.error("Failed to remove chip case:", error);
      toast({
        title: "Error",
        description: "Failed to remove chip case. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-full mx-auto p-4">
      <div className="w-full overflow-y-auto">
        <ChipCaseCarousel
          chipCases={chipCases}
          onCurrentIndexChange={setCurrentIndex}
          onEditChipCase={handleEditChipCase}
          onDeleteChipCase={handleRemoveChipCase}
        />
      </div>
      <div className="flex w-full items-center">
        <Button
          onClick={handleAddChipCase}
          variant="outline"
          size="sm"
          className="text-black hover:bg-primary/10"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Case
        </Button>
      </div>

      <ChipInputDialog
        open={chipInputDialogOpen}
        onOpenChange={setChipInputDialogOpen}
        mode={chipInputMode}
        chipCase={currentCase}
        onSubmit={handleChipInputSubmit}
      />
    </div>
  );
}
