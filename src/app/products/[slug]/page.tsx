import { Suspense } from 'react';
import ProductClient from './ProductClient';

export default function ProductSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F6F8F6] flex items-center justify-center font-sans">
          <p className="text-gray-500 font-bold">ডাটা লোড হচ্ছে...</p>
        </div>
      }
    >
      <ProductClient params={params} />
    </Suspense>
  );
}