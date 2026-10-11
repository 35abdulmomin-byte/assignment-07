'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: number | string;
  slug?: string;
  nameBn: string;
  category: string;
  unit: string;
  image?: string;
  categoryIcon?: string;
  today: number;
  change?: {
    dir: 'up' | 'down' | 'neutral' | string;
    pct: number;
  };
}

interface AllProductsProps {
  selectedCategory?: string;
}

export default function AllProducts({ selectedCategory = 'all' }: AllProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/bazardor/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to load products', err);
      }
    }
    loadProducts();
  }, []);

  const toBanglaDigits = (num: number | string) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/\d/g, (digit) => banglaDigits[parseInt(digit)]);
  };

  const formatPrice = (amount: number) => {
    const formatted = amount.toLocaleString('en-IN');
    return toBanglaDigits(formatted);
  };

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const priceUpProducts = selectedCategory === 'all' ? products.filter((p) => p.change?.dir === 'up') : [];
  const priceDownProducts = selectedCategory === 'all' ? products.filter((p) => p.change?.dir === 'down') : [];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans space-y-10">
      
      {/* ১. আজ দাম বেড়েছে সেকশন */}
      {selectedCategory === 'all' && priceUpProducts.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="text-red-500 font-bold">▲</span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              আজ দাম বেড়েছে
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {priceUpProducts.map((item) => (
              <ProductCard
                key={`up-${item.id}`}
                item={item}
                toBanglaDigits={toBanglaDigits}
                formatPrice={formatPrice}
              />
            ))}
          </div>
        </div>
      )}

      {/* ২. আজ দাম কমেছে সেকশন */}
      {selectedCategory === 'all' && priceDownProducts.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="text-emerald-500 font-bold">▼</span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              আজ দাম কমেছে
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {priceDownProducts.map((item) => (
              <ProductCard
                key={`down-${item.id}`}
                item={item}
                toBanglaDigits={toBanglaDigits}
                formatPrice={formatPrice}
              />
            ))}
          </div>
        </div>
      )}

      {/* ৩. সব পণ্য সেকশন */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {selectedCategory === 'all' ? 'সব পণ্য' : 'পণ্যসমূহ'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            মোট {toBanglaDigits(filteredProducts.length)}টি পণ্য দেখানো হচ্ছে
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((item) => (
            <ProductCard
              key={`all-${item.id}`}
              item={item}
              toBanglaDigits={toBanglaDigits}
              formatPrice={formatPrice}
            />
          ))}
        </div>
      </div>

    </section>
  );
}


function ProductCard({
  item,
  toBanglaDigits,
  formatPrice,
}: {
  item: Product;
  toBanglaDigits: (num: number | string) => string;
  formatPrice: (amount: number) => string;
}) {
  const router = useRouter();
  const pct = Math.abs(item.change?.pct || 0);
  const dir = item.change?.dir;

  const isUp = dir === 'up' && pct > 0;
  const isDown = dir === 'down' && pct > 0;

  const productPath = `/products/${item.slug || item.id}`;

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
      router.push(`/signin?redirectUrl=${encodeURIComponent(productPath)}`);
    } else {
      router.push(productPath);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between hover:shadow-md transition cursor-pointer select-none"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl shrink-0">
          {item.image || item.categoryIcon || '📦'}
        </div>

        <div>
          <h3 className="font-bold text-gray-900 text-base">
            {item.nameBn}
          </h3>
          <p className="text-xs text-gray-400">প্রতি {item.unit}</p>
          <p className="text-xs text-gray-400 mt-1">আজকের দাম</p>
          <p className="text-base font-bold text-gray-900">
            {formatPrice(item.today)} টাকা
          </p>
        </div>
      </div>

      <div
        className={`text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 self-end ${
          isUp
            ? 'bg-red-50 text-red-600'
            : isDown
            ? 'bg-emerald-50 text-emerald-600'
            : 'bg-gray-100 text-gray-500'
        }`}
      >
        <span>{isUp ? '▲' : isDown ? '▼' : '—'}</span>
        <span>{toBanglaDigits(pct.toFixed(1))}%</span>
      </div>
    </div>
  );
}