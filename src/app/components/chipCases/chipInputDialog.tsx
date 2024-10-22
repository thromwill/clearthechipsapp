"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, X, Camera } from "lucide-react";
import { ChipCase } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useGlobalState } from "@/app/components/GlobalStateProvider";
import { getChipCaseById } from "@/lib/api/chipCase";

interface ChipInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit" | "cashout";
  chipCase: ChipCase | null;
  onSubmit: (chips: { [color: string]: number }, caseName: string) => void;
}

export default function ChipInputDialog({
  open,
  onOpenChange,
  mode,
  chipCase,
  onSubmit,
}: ChipInputDialogProps) {
  const { getState } = useGlobalState();
  const context_game = getState("context_game");

  const [chipInputs, setChipInputs] = useState<
    { color: string; quantity: string }[]
  >([
    { color: "", quantity: "" },
    { color: "", quantity: "" },
    { color: "", quantity: "" },
  ]);
  const [caseName, setCaseName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchChipCase = async () => {
      if (mode === "edit" && chipCase) {
        setCaseName(chipCase.case_name || "");
        if (chipCase.chips) {
          const chipEntries = Object.entries(chipCase.chips);
          setChipInputs(
            chipEntries.map(([color, quantity]) => ({
              color,
              quantity: (quantity as number).toString(),
            }))
          );
        }
      } else if (mode === "add") {
        setCaseName("");
        setChipInputs([
          { color: "", quantity: "" },
          { color: "", quantity: "" },
          { color: "", quantity: "" },
        ]);
      } else if (mode === "cashout" && context_game?.case_id) {
        try {
          const gameChipCase = await getChipCaseById(context_game.case_id);
          if (gameChipCase.chips) {
            const chipEntries = Object.entries(gameChipCase.chips);
            setChipInputs(
              chipEntries.map(([color]) => ({
                color,
                quantity: "0",
              }))
            );
          }
        } catch (error) {
          console.error("Failed to fetch game chip case:", error);
          toast({
            title: "Error",
            description: "Failed to load game chip data.",
            variant: "destructive",
          });
        }
      }
    };

    fetchChipCase();
  }, [mode, chipCase, open, context_game?.case_id]);

  const handleAddChipInput = () => {
    if (chipInputs.length < 6) {
      setChipInputs([...chipInputs, { color: "", quantity: "" }]);
    }
  };

  const handleColorChange = (index: number, value: string) => {
    // Filter the input to allow only a-z, A-Z, and spaces
    // Enforce no more than 1 consecutive space and max length of 32 characters
    const filteredValue = value
      .replace(/[^a-zA-Z\s]/g, "") // Allow letters and spaces
      .replace(/\s{2,}/g, " ") // Replace consecutive spaces with a single space
      .trim() // Remove leading and trailing spaces
      .substring(0, 32); // Limit to 32 characters
  
    const updatedInputs = [...chipInputs];
    updatedInputs[index].color = filteredValue;
    setChipInputs(updatedInputs);
  };
  
  const handleQuantityChange = (index: number, value: string) => {
    // Filter the input to allow only numeric values and limit to 5 digits
    const filteredValue = value.replace(/[^0-9]/g, "").substring(0, 5);
  
    const updatedInputs = [...chipInputs];
    updatedInputs[index].quantity = filteredValue;
    setChipInputs(updatedInputs);
  };

  const handleRemoveChipInput = (index: number) => {
    if (chipInputs.length > 1) {
      setChipInputs(chipInputs.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = () => {
    // Check if the case name is required and empty
    if ((mode === "add" || mode === "edit") && !caseName.trim()) {
      toast({
        title: "Error",
        description: "Case name is required.",
        variant: "destructive",
      });
      return;
    }

    // Check case name length
    if ((mode === "add" || mode === "edit") && caseName.trim().length > 64) {
      toast({
        title: "Error",
        description: "Case name must be 64 characters or less.",
        variant: "destructive",
      });
      return;
    }

    // Check if all chip inputs have both color and quantity
    const hasEmptyFields = chipInputs.some(
      (input) => !input.color.trim() || !input.quantity.trim()
    );

    if (hasEmptyFields) {
      toast({
        title: "Error",
        description: "All chip color and quantity fields must be filled.",
        variant: "destructive",
      });
      return;
    }

    // Check for unique colors
    const colorSet = new Set();
    const hasDuplicateColors = chipInputs.some((input) => {
      if (input.color.trim()) {
        if (colorSet.has(input.color.trim())) {
          return true; // Duplicate found
        }
        colorSet.add(input.color.trim());
      }
      return false; // No duplicate found
    });

     

    if (hasDuplicateColors) {
      toast({
        title: "Error",
        description: "Chip colors must be unique.",
        variant: "destructive",
      });
      return;
    }
    
    const chips: { [color: string]: number } = {};
    chipInputs.forEach((input) => {
      if (input.color && input.quantity) {
        chips[input.color] = parseInt(input.quantity, 10);
      }
    });

    onSubmit(chips, caseName);
    onOpenChange(false);
  };

  const getDialogTitle = () => {
    switch (mode) {
      case "add":
        return "Add Chip Case";
      case "edit":
        return "Edit Chip Case";
      case "cashout":
        return "Cash Out";
      default:
        return "Chip Input";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {(mode === "add" || mode === "edit") && (
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="caseName">Case Name</Label>
              <Input
                id="caseName"
                value={caseName}
                onChange={(e) => setCaseName(e.target.value)}
                placeholder="Enter case name"
              />
            </div>
          )}

          <Button variant="secondary" disabled>
            <Camera className="mr-2 h-4 w-4" />
            Scan Chips
          </Button>

          <div className="grid gap-2">
            <Label>Or enter manually</Label>
            {chipInputs.map((input, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Color"
                  value={input.color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  className="w-full"
                  disabled={mode === "cashout"}
                />
                <Input
                  type="text"
                  placeholder="Quantity"
                  value={input.quantity}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                  className="w-full"
                />
                {mode !== "cashout" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveChipInput(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {mode !== "cashout" && chipInputs.length < 6 && (
              <Button
                type="button"
                onClick={handleAddChipInput}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Chip
              </Button>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {mode === "cashout" ? "Cash Out" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
