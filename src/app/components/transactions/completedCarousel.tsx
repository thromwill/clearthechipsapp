"use client";

import React from "react";
import Carousel from "@/app/components/shared/carousel";
import TransactionCard from "@/app/components/transactions/transactionCard";
import { Transaction } from "@/lib/types";

const CompletedCarousel: React.FC<CompletedCarouselProps> = ({
  transactions,
}) => {
  const renderTransactionItem = (
    transaction: Transaction,
    index: number,
    handleSlideClick: (index: number) => void
  ) => (
    <div
      className="flex transition-transform scale-75 -mx-6"
      onClick={() => handleSlideClick(index)}
    >
      <TransactionCard transaction={transaction} />
    </div>
  );

  return (
    <Carousel
      items={transactions}
      renderItem={renderTransactionItem}
      slidesPerView={2.2}
      spaceBetween={10}
      centeredSlides={false}
    />
  );
};

type CompletedCarouselProps = {
  transactions: Transaction[];
};

export default CompletedCarousel;
