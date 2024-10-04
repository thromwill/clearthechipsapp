import Image from "next/image";

type Transaction = {
  id: number;
  byName: string;
  forName: string;
  amount: number;
  date: string;
  avatarPath: string;
};

type TransactionCardProps = {
  transaction: Transaction;
};

export default function TransactionCard({ transaction }: TransactionCardProps) {
  return (
    <div className="flex flex-col bg-white w-60 h-80 rounded-lg p-4 transition-transform">
      <div className="flex justify-end w-full">
        <button className="bg-blue-500 text-white text-sm px-2 py-1 rounded-lg shadow">
          Remind
        </button>
      </div>
      <div className="flex flex-col items-center mt-4">
        <Image
          src={transaction.avatarPath}
          alt="Avatar"
          width={100}
          height={100}
          className="mb-4 rounded-full"
        />
        <span
          className={`text-lg font-semibold ${
            transaction.amount > 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {transaction.amount > 0 ? "+" : "-"}${Math.abs(transaction.amount)}
        </span>
      </div>
      <div className="mt-4 w-full">
        <div className="text-sm text-gray-600">from</div>
        <div className="font-semibold">{transaction.byName}</div>
      </div>
      <div className="flex justify-between items-center mt-auto w-full">
        <div className="text-sm text-gray-500">{transaction.date}</div>
        <button className="text-xs text-blue-500 underline">Details</button>
      </div>
    </div>
  );
}
