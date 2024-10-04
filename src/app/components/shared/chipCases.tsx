"use client";

import React, { useState } from "react";
import Image from "next/image";
import ChipCaseImage from '@/public/images/chipCase.png';
import Carousel from "./carousel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

type ChipCase = {
  id: number;
};

export default function ChipCases() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [chipCases, setChipCases] = useState<ChipCase[]>([
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
  ]);

  const handleAddChipCase = () => {
    if (chipCases.length < 12) {
      const newId = chipCases.length + 1;
      setChipCases([...chipCases, { id: newId }]);
    }
  };

  const handleRemoveChipCase = (index: number) => {
    const updatedCases = chipCases.filter((_, i) => i !== index);
    setChipCases(updatedCases);
  };

  const handleEditChipCase = (index: number, newId: number) => {
    const updatedCases = [...chipCases];
    updatedCases[index] = { id: newId };
    setChipCases(updatedCases);
  };

  const renderChipCaseItem = (
    chipCase: ChipCase,
    index: number,
    handleSlideClick: (index: number) => void,
    currentIndex: number
  ) => (
    <Card
      className={`flex flex-col items-center justify-center w-32 h-32 transition-all ${
        index === currentIndex
          ? "scale-100 z-20"
          : "scale-75 z-10 -translate-y-4"
      }`}
      onClick={() => handleSlideClick(index)}
    >
      <Image
        src={ChipCaseImage}
        alt={`Chip Case ${chipCase.id}`}
        width={80}
        height={80}
        className="mb-2"
      />
      <span className="text-sm font-medium text-gray-700">Case {chipCase.id}</span>
    </Card>
  );

  return (
    <div>
      <Button
        onClick={() => setDialogOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        Your Chip Cases
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">Your Chip Cases</DialogTitle>
          </DialogHeader>
          <div className="py-4 -mx-3">
            <Carousel
              items={chipCases}
              renderItem={renderChipCaseItem}
            />
          </div>
          <DialogFooter className="flex space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Button
              onClick={handleAddChipCase}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              New Case
            </Button>
            <Button
              onClick={() => handleEditChipCase(0, 999)}
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              Edit
            </Button>
            <Button
              onClick={() => setDialogOpen(false)}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}