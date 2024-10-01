import Link from 'next/link';
import { UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md fixed w-full top-0 z-10">
        <Link
        href="/gameroom" /* Change this back to home route once gameroom is implemented*/
        className="text-xl font-semibold text-black"
        > Clear The Chips </Link>
        <UserButton showName />
    </header>
  );
}
