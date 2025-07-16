import { Leaf } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Carbon Coin Home">
      <div className="p-1.5 bg-primary/20 rounded-lg">
        <Leaf className="h-6 w-6 text-primary" />
      </div>
      <span className="font-headline text-xl font-bold tracking-wider">Carbon Coin</span>
    </Link>
  );
}
