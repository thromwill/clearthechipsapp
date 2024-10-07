import React, { useState } from "react";
import ChipInputDialog from "@/app/components/chipCases/chipInputDialog";
import { Button } from "@/components/ui/button";

export default function CashoutComponent() {
  const [cashoutDialogOpen, setCashoutDialogOpen] = useState(false);

  const handleCashout = (chips: { [color: string]: number }) => {
    console.log("Cashing out with the following chips:", chips);
  };

  return (
    <div className="flex items-center justify-center">
      <Button
        type="button"
        onClick={() => setCashoutDialogOpen(true)}
        className="p-0 text-blue-600 text-xs bg-transparent hover:underline"
        variant="link"
      >
        Cash Out
      </Button>

      <ChipInputDialog
        open={cashoutDialogOpen}
        onOpenChange={setCashoutDialogOpen}
        mode="cashout"
        chipCase={null}
        onSubmit={handleCashout}
      />
    </div>
  );
}
