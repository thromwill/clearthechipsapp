"use client"

import React, { useEffect, useState } from "react";
import CompletedCarousel from "@/app/components/transactions/completedCarousel";
import PendingCarousel from "@/app/components/transactions/pendingCarousel";
import { ChevronRight } from "lucide-react";
import { Transaction } from "@/lib/types";
import { getTransactionsByPlayerId } from "@/lib/api/transaction";
import { useGlobalState } from "@/app/components/GlobalStateProvider";
import { useToast } from "@/hooks/use-toast";

export default function Transactions() {
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([]);
  const [completedTransactions, setCompletedTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { getState } = useGlobalState();
  
  const context_player = getState("context_player");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!context_player) {
          toast({
            title: "Error",
            description: "Player is missing.",
            variant: "destructive",
          });
          return;
        }
        
        // Fetch transactions by player ID
        const transactions = await getTransactionsByPlayerId(context_player.player_id);

        // Separate transactions into pending and completed
        const pending = transactions.filter((t) => !t.completed);
        const completed = transactions.filter((t) => t.completed);

        setPendingTransactions(pending);
        setCompletedTransactions(completed);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        toast({
          title: "Error",
          description: "Failed to fetch transactions. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [context_player, toast]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
};

  if (loading) {
    return <div className="p-4 md:p-8 min-h-screen">Loading transactions...</div>;
  }

  return (
    <div className="p-4 md:p-8 min-h-screen overflow-y-auto bg-[var(--background)]">
      <div className="space-y-8 md:space-y-12">
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-[var(--foreground)]">
              Pending<br />Transactions
            </h2>
            <button className="text-sm flex items-center justify-center text-[var(--foreground)]">
              See All
              <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          </div>
          {pendingTransactions.length > 0 ? (
            <PendingCarousel transactions={pendingTransactions.map(tx => ({
              ...tx,
              from_name: `${tx.by?.first_name} ${tx.by?.last_name }`,
              created: tx.created ? formatDate(tx.created) : "N/A",
            }))} />
          ) : (
            <p className="text-gray-500">No pending transactions.</p>
          )}
        </section>

        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-[var(--foreground)]">
              Completed<br />Transactions
            </h2>
            <button className="text-sm flex items-center justify-center text-[var(--foreground)]">
              See All
              <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          </div>
          {completedTransactions.length > 0 ? (
            <CompletedCarousel transactions={completedTransactions.map(tx => ({
              ...tx,
              from_name: `${tx.by?.first_name} ${tx.by?.last_name}`,
              created: tx.created ? formatDate(tx.created) : "N/A",
            }))} />
          ) : (
            <p className="text-gray-500">No completed transactions.</p>
          )}
        </section>
      </div>
    </div>
  );
}
