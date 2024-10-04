"use client"

import React, { useState, useEffect } from 'react'
import { useUser } from "@clerk/nextjs"
import { useDataContext } from './Context'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader} from "@/components/ui/card"

export default function Home() {
  const { user } = useUser()

  const handleJoinGame = () => {
    
  }
  
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4 md:p-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
        </CardHeader>
        <CardContent className="space-y-6">
          <NumberInput maxLength={5} />
          <Button
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium text-lg transition duration-300"
            onClick={handleJoinGame}
          >
            Join Game
          </Button>
          <div className="w-full flex justify-center">
            <CreateGame />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function NumberInput({ maxLength }: { maxLength: number }) {
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    if (newValue.length <= maxLength && /^[0-9]*$/.test(newValue)) {
      setValue(newValue)
    }
  }

  return (
    <Input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={value}
      onChange={handleChange}
      placeholder="Enter Game Pin"
      className="h-12 text-center text-lg font-semibold focus:ring-2 focus:ring-gray-300 border border-gray-200 text-gray-800 placeholder-gray-400"
      maxLength={maxLength}
    />
  )
}

function CreateGame() {
  const [showModal, setShowModal] = useState(false)
  const [gameName, setGameName] = useState('')
  const [stakes, setStakes] = useState('')

  return (
    <>
      <Button
        variant="link"
        className="text-blue-500 hover:text-blue-600"
        onClick={() => setShowModal(true)}
      >
        Create New Game
      </Button>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-gray-800">Create New Game</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Game Name"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              className="bg-white border-gray-300 text-gray-800 placeholder-gray-400"
            />
            <Select value={stakes} onValueChange={setStakes}>
              <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                <SelectValue placeholder="Select Stakes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.01/0.02">$0.01 / $0.02</SelectItem>
                <SelectItem value="0.02/0.05">$0.02 / $0.05</SelectItem>
                <SelectItem value="0.05/0.10">$0.05 / $0.10</SelectItem>
                <SelectItem value="0.10/0.20">$0.10 / $0.20</SelectItem>
                <SelectItem value="0.25/0.50">$0.25 / $0.50</SelectItem>
                <SelectItem value="0.50/1.00">$0.50 / $1.00</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Button
              type="submit"
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => {
                // Handle game creation logic here
                setShowModal(false)
              }}
            >
              Create Game
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto border-gray-300 text-gray-800 hover:bg-gray-100"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}