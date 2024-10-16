import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChipCase } from "@/lib/types";
import ChipCaseImage from "@/public/images/chip_case.png";
import { Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ChipCaseCardProps {
  chipCase: ChipCase;
  isActive: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}

const ChipCaseCard: React.FC<ChipCaseCardProps> = ({
  chipCase,
  isActive,
  onEdit,
  onDelete,
  onClick,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCardClick = () => {
    if (isActive) {
      setIsDialogOpen(true);
    } else {
      onClick();
    }
  };

  return (
    <>
      <div
        className={`flex flex-col items-center justify-center bg-white rounded-lg shadow-sm cursor-pointer transition-all duration-300
          ${
            isActive
              ? "transform scale-100 z-20 w-full max-w-[120px] aspect-square border-2 border-primary"
              : "transform scale-90 z-10 opacity-50 w-full max-w-[100px] aspect-square border"
          }`}
        onClick={handleCardClick}
      >
        <div className="relative w-3/4 aspect-square mb-2">
          <Image
            src={ChipCaseImage}
            alt={chipCase.case_name || "Chip Case"}
            layout="fill"
            objectFit="contain"
            className="rounded-full"
          />
        </div>
        <span className="text-xs sm:text-sm font-semibold text-gray-800 text-center px-2 truncate max-w-full">
          {chipCase.case_name}
        </span>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{chipCase.case_name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="text-sm text-gray-600">
              {Object.entries(chipCase.chips).map(([color, count]) => (
                <div key={color} className="flex justify-between">
                  <span>{color}:</span>
                  <span>{count as React.ReactNode}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <Button size="sm" variant="outline" onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button size="sm" variant="outline" onClick={onDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChipCaseCard;
