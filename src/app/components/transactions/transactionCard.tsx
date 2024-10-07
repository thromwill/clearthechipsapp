import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import AvatarImg from "/src/public/images/avatars/1.png";
import { Transaction } from "@/lib/types";

type TransactionCardProps = {
  transaction: Transaction;
  isSelected?: boolean;
  onClick?: () => void;
};

export default function TransactionCard({
  transaction,
  isSelected = false,
  onClick,
}: TransactionCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col bg-white w-60 h-80 rounded-lg p-4 transition-all duration-300 ease-in-out",
        "border-2",
        isSelected
          ? "border-blue-500 ring-2 ring-blue-300"
          : isHovered
          ? "border-gray-200"
          : "border-gray-100",
        "cursor-pointer"
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-end w-full">
        <button className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full shadow-sm hover:bg-blue-600 transition-colors duration-200">
          Remind
        </button>
      </div>
      <div className="flex flex-col items-center mt-4">
        <div className="relative w-24 h-24 mb-4">
          <Image
            src={AvatarImg}
            alt="Avatar"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
        <span
          className={cn(
            "text-lg font-semibold",
            transaction.amount > 0 ? "text-green-500" : "text-red-500"
          )}
        >
          {transaction.amount > 0 ? "+" : "-"}$
          {Math.abs(transaction.amount).toFixed(2)}
        </span>
      </div>
      <div className="mt-4 w-full">
        <div className="text-sm text-gray-600">from</div>
        <div className="font-semibold truncate">{transaction.by_id}</div>
      </div>
      <div className="flex justify-between items-center mt-auto w-full">
        <div className="text-sm text-gray-500">{transaction.created}</div>
        <button className="text-xs text-blue-500 hover:text-blue-600 hover:underline transition-colors duration-200">
          Details
        </button>
      </div>
    </div>
  );
}
