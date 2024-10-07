"use client"
// TODO: disallow duplicate color names -> json only gets 1
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { PlusCircle, X, Camera } from "lucide-react"
import { ChipCase } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useGlobalState } from "@/app/components/GlobalStateProvider"

interface ChipInputDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "add" | "edit" | "cashout"
  chipCase: ChipCase | null
  onSubmit: (chips: { [color: string]: number }, caseName: string) => void
}

export default function ChipInputDialog({
  open,
  onOpenChange,
  mode,
  chipCase,
  onSubmit,
}: ChipInputDialogProps) {
  const { getState } = useGlobalState()
  const player_id = getState("player_id")
  
  const [chipInputs, setChipInputs] = useState([
    { color: "", quantity: "" },
    { color: "", quantity: "" },
    { color: "", quantity: "" },
  ])
  const [caseName, setCaseName] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (mode === "edit" && chipCase) {
      setCaseName(chipCase.case_name || "")
      if (chipCase.chips) {
        const chipEntries = Object.entries(chipCase.chips)
        console.log(chipEntries)
        setChipInputs(
          chipEntries.map(([color, quantity]) => ({
            color,
            quantity: quantity.toString(),
          }))
        )
      }
    } else if (mode === "add") {
      setCaseName("")
      setChipInputs([
        { color: "", quantity: "" },
        { color: "", quantity: "" },
        { color: "", quantity: "" },
      ])
    }
  }, [mode, chipCase, open])

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

  const handleSubmit = () => {
    const chips: { [color: string]: number } = {}
    chipInputs.forEach((input) => {
      if (input.color && input.quantity) {
        chips[input.color] = parseInt(input.quantity, 10)
      }
    })

    onSubmit(chips, caseName)
    onOpenChange(false)
  }

  const getDialogTitle = () => {
    switch (mode) {
      case "add":
        return "Add Chip Case"
      case "edit":
        return "Edit Chip Case"
      case "cashout":
        return "Cash Out"
      default:
        return "Chip Input"
    }
  }

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
            {chipInputs.length < 6 && (
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
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {mode === "cashout" ? "Cash Out" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}