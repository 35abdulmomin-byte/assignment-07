'use client';

import { useEffect, useState, use } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

interface Product {
  id: string | number;
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

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();
  const pathname = usePathname();

  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [sortOption, setSortOption] = useState<string>('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn !== 'true') {
      toast.error('পণ্যটির বিস্তারিত দেখতে প্রথমে সাইন ইন করুন!');
      setTimeout(() => {
        router.replace(`/signin?redirectUrl=${encodeURIComponent(pathname)}`);
      }, 500);
      return;
    }

    setAuthorized(true);

    async function fetchData() {
      try {
        const res = await fetch(`/api/bazardor/products`);
        if (!res.ok) {
          setError(true);
          return;
        }
        const data: Product[] = await res.json();
        
        const found = data.find((p) => String(p.id) === productId || p.slug === productId);

        if (!found) {
          setError(true);
          return;
        }

        setCurrentProduct(found);

        const sameCategory = data.filter((p) => p.category === found.category);
        setRelatedProducts(sameCategory);

      } catch (err) {
        console.error('Error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (productId) fetchData();
  }, [productId, pathname, router]);

  if (typeof window !== 'undefined' && localStorage.getItem('isLoggedIn') !== 'true') {
    return (
      <div className="min-h-screen bg-[#F6F8F6] flex items-center justify-center font-sans">
        <Toaster position="top-center" />
        <p className="text-gray-600 font-bold">সাইন-ইন পেজে রিডাইরেক্ট করা হচ্ছে...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#F6F8F6] flex items-center justify-center font-sans">
        <Toaster position="top-center" />
        <p className="text-gray-500 font-bold">যাচাই করা হচ্ছে...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F8F6] flex items-center justify-center font-sans">
        <Toaster position="top-center" />
        <p className="text-gray-500 font-bold">ডাটা লোড হচ্ছে...</p>
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="min-h-screen bg-[#F6F8F6] flex flex-col items-center justify-center gap-4 font-sans">
        <Toaster position="top-center" />
        <h1 className="text-4xl font-bold text-gray-800">404</h1>
        <p className="text-gray-600 font-medium">কোনো পণ্য পাওয়া যায়নি!</p>
        <Link
          href="/"
          className="px-5 py-2.5 bg-[#009A49] text-white rounded-xl text-sm font-bold shadow-xs hover:bg-[#00813d] transition"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  const toBanglaDigits = (num: number | string) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/\d/g, (digit) => banglaDigits[parseInt(digit)]);
  };

  const sortedProducts = [...relatedProducts].sort((a, b) => {
    if (sortOption === 'price-low') return a.today - b.today;
    if (sortOption === 'price-high') return b.today - a.today;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#F6F8F6] font-sans pb-16">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition">হোম</Link>
          <span>›</span>
          <span>{currentProduct.categoryNameBn || currentProduct.category}</span>
        </nav>

        {/* ১. ক্যাটাগরি হেডার কার্ড */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl shrink-0">
            {currentProduct.image || currentProduct.categoryIcon || '🍚'}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {currentProduct.categoryNameBn || currentProduct.category}
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              প্রতি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </div>

        {/* ২. সাজান (Sorting) ফিল্টার বার */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-end">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <span>সাজান</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 font-medium text-gray-700 outline-none focus:border-[#009A49] transition cursor-pointer"
            >
              <option value="default">ডিফল্ট</option>
              <option value="price-low">দাম: কম থেকে বেশি</option>
              <option value="price-high">দাম: বেশি থেকে কম</option>
            </select>
          </div>
        </div>

        {/* ৩. মোট কতটি পণ্য দেখানো হচ্ছে */}
        <div className="text-xs sm:text-sm text-gray-500 font-medium px-1">
          মোট {toBanglaDigits(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে
        </div>

        {/* ৪. পণ্যসমূহের কার্ড গ্রিড */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedProducts.map((item) => {
            const pct = Math.abs(item.change?.pct || 0);
            const dir = item.change?.dir;
            const isUp = dir === 'up' && pct > 0;
            const isDown = dir === 'down' && pct > 0;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-4 border transition flex items-center justify-between ${
                  String(item.id) === String(productId)
                    ? 'border-[#009A49] ring-1 ring-[#009A49]'
                    : 'border-gray-100 shadow-xs hover:shadow-md'
                }`}
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
                      {toBanglaDigits(item.today)} টাকা
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
          })}
        </div>

      </div>
    </div>
  );
}