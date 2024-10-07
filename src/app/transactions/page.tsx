import React from "react";
import CompletedCarousel from "@/app/components/transactions/completedCarousel";
import PendingCarousel from "@/app/components/transactions/pendingCarousel";
import { ChevronRight } from "lucide-react"
import { Transaction } from "@/lib/types";


const transactions: Transaction[] = Array.from({ length: 10 }, (_, i) => ({
  transaction_id: (i + 1).toString(),
  by_id: `by_id_${i}`,
  for_id: `for_id_${i}`,
  amount: 5.0,
  created: "2020-01-01",
  completed: "2020-01-02",
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