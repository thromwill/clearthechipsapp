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
      <div className="space-y-8 md:space-y-12">
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-black text-2xl md:text-3xl font-semibold">
              Pending<br />Transactions
            </h2>
            <button className="text-sm text-black flex items-center justify-center">
              See All
              <ChevronRight className="text-black ml-1 h-4 w-4" />
            </button>
          </div>
          <PendingCarousel transactions={transactions} />
        </section>

        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-black text-2xl md:text-3xl font-semibold">
              Completed<br />Transactions
            </h2>
            <button className="text-sm text-black flex items-center justify-center">
              See All
              <ChevronRight className="text-black ml-1 h-4 w-4" />
            </button>
          </div>
          <CompletedCarousel transactions={transactions} />
        </section>
      </div>
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