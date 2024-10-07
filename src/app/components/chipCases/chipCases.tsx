"use client";

import React, { useState, useEffect } from "react";
import ChipCaseCarousel from "@/app/components/chipCases/chipCaseCarousel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { PlusCircle, Edit, Trash2 } from "lucide-react";

interface ChipCasesProps {
  onSelect?: (caseId: string) => void;
}

export default function ChipCases({ onSelect }: ChipCasesProps) {
  const { getState } = useGlobalState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [chipInputDialogOpen, setChipInputDialogOpen] = useState(false);
  const [chipCases, setChipCases] = useState<ChipCase[]>([]);
  const [currentCase, setCurrentCase] = useState<ChipCase | null>(null);
  const [chipInputMode, setChipInputMode] = useState<"add" | "edit">("add");
  const { toast } = useToast();

  const player_id = getState("player_id");
  
  useEffect(() => {
    if (player_id) {
      fetchChipCases();
    }
  }, [player_id]); 

  const fetchChipCases = async () => {
    try {
      const cases = await getChipCasesByPlayerId(player_id);
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

  const handleEditChipCase = () => {
    const chipCase = chipCases[currentIndex];
    setCurrentCase(chipCase);
    setChipInputMode("edit");
    setChipInputDialogOpen(true);
  };

  const handleChipInputSubmit = async (chips: { [color: string]: number }, caseName: string) => {
    try {
      const updatedCase = await createOrUpdateChipCase({
        case_id: currentCase?.case_id || generateUUID(),
        player_id: player_id,
        case_name: caseName,
        chips: chips,
      });

      if (currentCase) {
        setChipCases(chipCases.map(c => c.case_id === updatedCase.case_id ? updatedCase : c));
      } else {
        setChipCases([...chipCases, updatedCase]);
      }

      toast({
        title: "Success",
        description: `Chip case ${currentCase ? "updated" : "added"} successfully.`,
      });
    } catch (error) {
      console.error("Failed to save chip case:", error);
      toast({
        title: "Error",
        description: `Failed to ${currentCase ? "update" : "add"} chip case. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleRemoveChipCase = async () => {
    const chipCase = chipCases[currentIndex];
    if (!chipCase) return;

    try {
      await removeChipCase(chipCase.case_id);
      setChipCases(chipCases.filter((_, i) => i !== currentIndex));
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

  const handleSelectCase = () => {
    if (onSelect && chipCases[currentIndex]) {
      onSelect(chipCases[currentIndex].case_id);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {!onSelect && (
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Manage Chip Cases
        </Button>
      )}

      <Dialog open={dialogOpen || !!onSelect} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              {onSelect ? "Select Chip Case" : "Your Chip Cases"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <ChipCaseCarousel 
              chipCases={chipCases}
              onCurrentIndexChange={setCurrentIndex}
            />
          </div>
          <DialogFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              <Button
                onClick={handleAddChipCase}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                New Case
              </Button>
              <Button
                onClick={handleEditChipCase}
                variant="outline"
                className="border-blue-500 text-blue-500 hover:bg-blue-50"
                disabled={chipCases.length === 0}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={handleRemoveChipCase}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50"
                disabled={chipCases.length === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
            {onSelect && (
              <Button onClick={handleSelectCase} disabled={chipCases.length === 0}>
                Select Case
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

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