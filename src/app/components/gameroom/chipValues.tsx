import React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CircleDollarSign, Coins } from "lucide-react"

interface Chip {
  color: string
  value: number
}

interface ChipValuesProps {
  chipValues: Record<string, number>
  moneyInTheGame: number
  moneyOnTable: number
}

const ChipValues: React.FC<ChipValuesProps> = ({ chipValues, moneyInTheGame, moneyOnTable }) => {
  const convertedChipValues: Chip[] = Object.entries(chipValues)
    .sort(([, valueA], [, valueB]) => valueA - valueB)
    .map(([color, value]) => ({
      color,
      value: typeof value === "number" ? value : parseInt(value, 10) || 0,
    }))

  const renderChipValue = ({ color, value }: Chip) => (
    <div key={color} className="flex items-center justify-between p-3 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors">
      <div className="flex items-center space-x-2">
        {/* <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.toLowerCase() }} /> */}
        <span className="font-medium text-sm">{color}</span>
      </div>
      <span className="text-sm font-semibold">${value}</span>
    </div>
  )

  return (
    <div className="space-y-4">
      <Card className="w-full bg-gradient-to-r from-primary/10 via-primary/5 to-background">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <CircleDollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">In the Game</p>
                <p className="text-lg font-bold text-primary">${moneyInTheGame.toFixed(2)}</p>
              </div>
            </div>
            <Separator orientation="vertical" className="h-10" />
            <div className="flex items-center space-x-2">
              <Coins className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">On the Table</p>
                <p className="text-lg font-bold text-primary">${moneyOnTable.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full bg-gradient-to-b from-background to-muted/20 shadow-md">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Chip Values</h3>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {convertedChipValues.length > 0 ? (
                convertedChipValues.map(renderChipValue)
              ) : (
                <p className="text-sm text-muted-foreground text-center">No chip values available.</p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

export default ChipValues