'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: number | string;
  slug?: string;
  nameBn: string;
  category: string;
  categoryNameBn?: string;
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
  const [sortType, setSortType] = useState<string>('default');

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

  // ১. ক্যাটাগরি ফিল্টারিং
  let filteredProducts = products.filter((p) => {
    if (selectedCategory === 'all') return true;
    const pCat = (p.category || '').toLowerCase();
    const sCat = selectedCategory.toLowerCase();
    return pCat === sCat || pCat.includes(sCat) || sCat.includes(pCat);
  });

  // ২. সর্টিং (ডিফল্ট / কম থেকে বেশি / বেশি থেকে কম)
  if (sortType === 'low-high') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.today - b.today);
  } else if (sortType === 'high-low') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.today - a.today);
  }

  const priceUpProducts = selectedCategory === 'all' ? products.filter((p) => p.change?.dir === 'up') : [];
  const priceDownProducts = selectedCategory === 'all' ? products.filter((p) => p.change?.dir === 'down') : [];

  // ক্যাটাগরির বাংলা নাম নির্ধারণ
  const currentCategoryObj = products.find(p => p.category === selectedCategory);
  const categoryHeaderName = selectedCategory === 'all' 
    ? 'সব পণ্য' 
    : (currentCategoryObj?.categoryNameBn || selectedCategory);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans space-y-6">
      
      {/* ১. আজ দাম বেড়েছে সেকশন (হোম পেজ/সব ক্যাটাগরিতে) */}
      {selectedCategory === 'all' && priceUpProducts.length > 0 && (
        <div className="mb-8">
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

      {/* ২. আজ দাম কমেছে সেকশন (হোম পেজ/সব ক্যাটাগরিতে) */}
      {selectedCategory === 'all' && priceDownProducts.length > 0 && (
        <div className="mb-8">
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

      {/* ৩. ক্যাটাগরি টাইটেল ব্যানার (স্ক্রিনশটের ওপরের বক্স) */}
      {selectedCategory !== 'all' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl shrink-0">
            {currentCategoryObj?.categoryIcon || '🌾'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {categoryHeaderName}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              প্রতি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </div>
      )}

      {/* ৪. সর্টিং ফিল্টার বার ("সাজান: ডিফল্ট" ড্রপডাউন) */}
      <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-xs flex items-center justify-end">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
          <span>সাজান</span>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-800 text-xs sm:text-sm font-medium rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#009A49] transition cursor-pointer"
          >
            <option value="default">ডিফল্ট</option>
            <option value="low-high">দাম: কম থেকে বেশি</option>
            <option value="high-low">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      {/* ৫. পণ্যের সংখ্যা ও কার্ড গ্রিড */}
      <div>
        <div className="mb-4">
          <p className="text-xs sm:text-sm text-gray-500">
            মোট {toBanglaDigits(filteredProducts.length)}টি পণ্য দেখানো হচ্ছে
          </p>
        </div>

        {filteredProducts.length > 0 ? (
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
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 text-gray-500">
            এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য পাওয়া যায়নি।
          </div>
        )}
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
  const pct = Math.abs(item.change?.pct || 0);
  const dir = item.change?.dir;

  const isUp = dir === 'up' && pct > 0;
  const isDown = dir === 'down' && pct > 0;

  const productPath = `/products/${item.slug || item.id}`;

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // কার্ডে ক্লিক করলে ডিটেইলসে যাওয়ার আগে সাইন-ইন চেক করা
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
      window.location.href = `/signin?redirectUrl=${encodeURIComponent(productPath)}`;
    } else {
      window.location.href = productPath;
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