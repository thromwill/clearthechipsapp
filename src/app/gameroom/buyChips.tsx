"use client";
import moneyIcon from '@/public/images/moneyIcon.svg';
import React, { useState } from 'react'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ChevronDown } from "lucide-react"

export default function BuyChips() {
  const [enteredAmount, setEnteredAmount] = useState<string>('')

  const handleBuyChipsEnter = () => {
    console.log(`Entered amount: ${enteredAmount}`)
    // Add your logic here to process the buy-in
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="flex items-center justify-between w-36 h-8 bg-white rounded-full px-2 mb-2"
        >
          <Image src={moneyIcon} alt="Money" className="w-5 h-5" />
          <span className="text-sm text-dark-text font-semibold">Buy Chips</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buy Chips</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="buy-in-amount">Enter buy-in amount</Label>
            <Input
              id="buy-in-amount"
              type="number"
              placeholder="Enter buy-in amount"
              value={enteredAmount}
              onChange={(e) => setEnteredAmount(e.target.value)}
            />
          </div>
          <Button onClick={handleBuyChipsEnter}>Enter</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
