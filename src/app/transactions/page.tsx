import React from "react";
import CompletedCarousel from "./completedCarousel";
import PendingCarousel from "./pendingCarousel";
import { ChevronRight } from "lucide-react"

const transactions: Transaction[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  byName: "By Name",
  forName: "For Name",
  amount: 5.0,
  date: "1 1 2020",
  avatarPath: `/images/avatars/${i}.png`,
}));

export default function Transactions() {
  return (
    <div className="p-4 md:p-8 min-h-screen overflow-y-auto">
      <div className="flex flex-row md:flex-row justify-between items-end w-full">
        <div className="flex flex-col">
          <h1 className="text-white text-2xl md:text-3xl">Pending</h1>
          <h1 className="text-white text-2xl md:text-3xl">Transactions</h1>
        </div>
        <div className="flex items-center justify-center">
            <button className="text-sm text-white">
              See All
            </button>
            <ChevronRight className="text-white ml-1 h-4 w-4" />
          </div>
      </div>

      <PendingCarousel transactions={transactions} />

      <div className="flex flex-col -my-12">
        <div className="flex flex-red md:flex-row justify-between items-end w-full mt-8">
          <div className="flex flex-col">
            <h1 className="text-white text-2xl md:text-3xl">Completed</h1>
            <h1 className="text-white text-2xl md:text-3xl">Transactions</h1>
          </div>
          <div className="flex items-center justify-center">
            <button className="text-sm text-white">
              See All
            </button>
            <ChevronRight className="text-white ml-1 h-4 w-4" />
          </div>
        </div>

        <div className="-my-10">
          <CompletedCarousel transactions={transactions} />
        </div>
      </div>

      <div className="h-96"></div>
    </div>
  );
}

type Transaction = {
  id: number;
  byName: string;
  forName: string;
  amount: number;
  date: string;
  avatarPath: string;
};



