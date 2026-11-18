'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function IngredientsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/app/menu?view=ingredients');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh] text-[#66523B] text-sm">
      Loading Ingredients Ledger...
    </div>
  );
}
