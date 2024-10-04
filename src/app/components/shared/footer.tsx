import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Clear The Chips</h3>
            <p className="text-gray-600">Experience the thrill of online poker with friends.</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-600 hover:text-blue-600">About Us</Link></li>
              <li><Link href="/faq" className="text-gray-600 hover:text-blue-600">FAQ</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link></li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h3 className="text-lg font-semibold mb-2">Connect With Us</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Facebook</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Twitter</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600">&copy; {new Date().getFullYear()} Clear The Chips. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}