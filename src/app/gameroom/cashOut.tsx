"use client"

import React, { useState } from "react"
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
import { PlusCircle, X } from "lucide-react"

export default function Cashout() {
  const [chipInputs, setChipInputs] = useState([{ color: "", quantity: "" }])

  const handleAddChipInput = () => {
    if (chipInputs.length < 6) {
      setChipInputs([...chipInputs, { color: "", quantity: "" }])
    }
  }

  const handleColorChange = (index: number, value: string) => {
    const updatedInputs = [...chipInputs]
    updatedInputs[index].color = value
    setChipInputs(updatedInputs)
  }

  const handleQuantityChange = (index: number, value: string) => {
    const updatedInputs = [...chipInputs]
    updatedInputs[index].quantity = value
    setChipInputs(updatedInputs)
  }

  const handleRemoveChipInput = (index: number) => {
    if (chipInputs.length > 1) {
      setChipInputs(chipInputs.filter((_, i) => i !== index))
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-sm">
          Cash Out
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cash Out</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button variant="secondary" disabled>
            Scan Chips
          </Button>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="picture">Or upload your own image</Label>
            <Input id="picture" type="file" accept="image/*" disabled />
          </div>

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
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={input.quantity}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                  className="w-full"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveChipInput(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
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
          </div>

          <Button type="submit" disabled>
            Enter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}