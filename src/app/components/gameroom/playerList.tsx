import React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Play } from "@/lib/types"

interface PlayerListProps {
  plays: Play[]
}

export default function PlayerList({ plays }: PlayerListProps) {
  const activePlays = plays.filter((play) => play.is_currently_playing)
  const inactivePlays = plays.filter((play) => !play.is_currently_playing)

  const renderPlayer = (play: Play) => {
    const buyIn = play.buyin || 0
    const cashOut = play.cashout || 0
    const difference = cashOut - buyIn
    const differenceClass = difference >= 0 ? "text-green-500" : "text-red-500"

    return (
      <div key={play.player_id} className="flex items-center space-x-4 p-3 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors">
        <Avatar className="w-10 h-10 border-2 border-primary/10">
          <AvatarImage src={play.PLAYER.avatar_url} alt={`${play.PLAYER.first_name} ${play.PLAYER.last_name}`} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {play.PLAYER.first_name[0]}{play.PLAYER.last_name[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <p className="font-medium text-sm">{play.PLAYER.first_name} {play.PLAYER.last_name}</p>
          <div className="flex space-x-2">
            <p className="text-xs text-muted-foreground">In for ${buyIn.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Out for ${cashOut.toFixed(2)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-xs ${differenceClass}`}>
            {difference >= 0 ? "+" : "-"}${Math.abs(difference).toFixed(2)}
          </p>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full bg-gradient-to-b from-background to-muted/20 shadow-md">
        <ScrollArea className="pt-4 h-[400px] md:h-[600px]">
          <div className="px-4 py-2">
            <h3 className="text-xs font-medium text-muted-foreground mb-2">Currently Playing</h3>
            {activePlays.map(renderPlayer)}
            
            {inactivePlays.length > 0 && (
              <>
                <h3 className="text-xs font-medium text-muted-foreground mt-4 mb-2">Left the Game</h3>
                {inactivePlays.map(renderPlayer)}
              </>
            )}
          </div>
        </ScrollArea>
    </Card>
  )
}