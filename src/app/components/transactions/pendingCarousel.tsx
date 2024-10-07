"use client";

import React from "react";
import Carousel from "@/app/components/shared/carousel";
import TransactionCard from "./transactionCard";
import { Transaction } from "@/lib/types";

type PendingCarouselProps = {
  transactions: Transaction[];
};

const PendingCarousel: React.FC<PendingCarouselProps> = ({ transactions }) => {
  const renderTransactionItem = (
    transaction: Transaction,
    index: number,
    handleSlideClick: (index: number) => void,
    currentIndex: number
  ) => (
    <div
      className={`flex transition-transform ${
        index === currentIndex
          ? "transform scale-100 z-10"
          : "transform scale-75 z-10"
      }`}
      onClick={() => handleSlideClick(index)}
    >
      <TransactionCard transaction={transaction} />
    </div>
  );

  return (
    <Carousel
      items={transactions}
      renderItem={renderTransactionItem}
      slidesPerView={1.7}
      spaceBetween={10}
      centeredSlides={false}
    />
  );
};

export default PendingCarousel;
