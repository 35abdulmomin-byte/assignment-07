'use client';

import { useEffect, useState, use } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/componenets/Navbar';
import Footer from '@/componenets/Footer';
import { Toaster } from 'react-hot-toast';

interface Market {
  market: string;
  division: string;
  min: number;
  max: number;
  avg?: number;
}

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
  yesterday?: number;
  minPrice?: number;
  maxPrice?: number;
  avgPrice?: number;
  change?: {
    dir: 'up' | 'down' | 'neutral' | string;
    pct: number;
    amount?: number;
  };
  markets?: Market[];
}

export default function ProductClient({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slugParam = resolvedParams.slug;
  const pathname = usePathname();
  const router = useRouter();

  const [isCategoryView, setIsCategoryView] = useState<boolean>(false);
  const [singleProduct, setSingleProduct] = useState<Product | null>(null);
  const [categoryTitle, setCategoryTitle] = useState<string>('');
  const [categoryIcon, setCategoryIcon] = useState<string>('🍚');
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);

  const [sortOption, setSortOption] = useState<string>('default');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    // ১. কড়াভাবে লগইন স্ট্যাটাস চেক করা
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
      window.location.replace(`/signin?redirectUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    async function fetchData() {
      try {
        const res = await fetch(`/api/bazardor/products`);
        if (!res.ok) {
          setError(true);
          return;
        }
        const data: Product[] = await res.json();

        const exactProduct = data.find(
          (p) => p.slug === slugParam || String(p.id) === slugParam
        );

        if (exactProduct) {
          setIsCategoryView(false);
          setSingleProduct(exactProduct);
        } else {
          const matchedCategoryItems = data.filter(
            (p) => p.category === slugParam
          );

          if (matchedCategoryItems.length > 0) {
            setIsCategoryView(true);
            const firstItem = matchedCategoryItems[0];
            setCategoryTitle(firstItem.categoryNameBn || firstItem.category);
            setCategoryIcon(firstItem.categoryIcon || firstItem.image || '🍚');
            setCategoryProducts(matchedCategoryItems);
          } else {
            setError(true);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (slugParam) fetchData();
  }, [slugParam, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F8F6] flex flex-col justify-between font-sans">
        <Navbar selectedCategory={slugParam} />
        <div className="flex items-center justify-center py-20">
          <Toaster position="top-center" />
          <p className="text-gray-500 font-bold">ডাটা লোড হচ্ছে...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || (!isCategoryView && !singleProduct) || (isCategoryView && categoryProducts.length === 0)) {
    return (
      <div className="min-h-screen bg-[#F6F8F6] flex flex-col justify-between font-sans">
        <Navbar selectedCategory={slugParam} />
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <Toaster position="top-center" />
          <h1 className="text-4xl font-bold text-gray-800">404</h1>
          <p className="text-gray-600 font-medium">কোনো তথ্য পাওয়া যায়নি!</p>
          <Link
            href="/"
            className="px-5 py-2.5 bg-[#009A49] text-white rounded-xl text-sm font-bold shadow-xs hover:bg-[#00813d] transition"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const toBanglaDigits = (num: number | string | undefined) => {
    if (num === undefined || num === null) return '—';
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/\d/g, (digit) => banglaDigits[parseInt(digit)]);
  };

  const sortedCategoryProducts = [...categoryProducts].sort((a, b) => {
    if (sortOption === 'price-low') return a.today - b.today;
    if (sortOption === 'price-high') return b.today - a.today;
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F6F8F6] font-sans">
      <Toaster position="top-center" />

      <div>
        <Navbar
          selectedCategory={isCategoryView ? slugParam : singleProduct?.category || 'all'}
          onSelectCategory={(cat) => {
            if (cat === 'all') {
              router.push('/');
            } else {
              router.push(`/products/${cat}`);
            }
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {isCategoryView ? (
            <>
              <nav className="flex items-center gap-2 text-xs text-gray-500">
                <Link href="/" className="hover:text-gray-900 transition">হোম</Link>
                <span>›</span>
                <span className="text-gray-800 font-medium">{categoryTitle}</span>
              </nav>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl shrink-0">
                  {categoryIcon}
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {categoryTitle}
                  </h1>
                  <p className="text-xs text-gray-400 mt-1">
                    প্রতি পণ্যের আজকের দাম ও পরিবর্তন
                  </p>
                </div>
              </div>

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

              <div className="text-xs sm:text-sm text-gray-500 font-medium px-1">
                মোট {toBanglaDigits(sortedCategoryProducts.length)}টি পণ্য দেখানো হচ্ছে
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedCategoryProducts.map((item) => {
                  const pct = Math.abs(item.change?.pct || 0);
                  const dir = item.change?.dir;
                  const isUp = dir === 'up' && pct > 0;
                  const isDown = dir === 'down' && pct > 0;

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        router.push(`/products/${item.slug || item.id}`);
                      }}
                      className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs hover:shadow-md transition flex items-center justify-between cursor-pointer"
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
            </>
          ) : singleProduct ? (
            <>
              <nav className="flex items-center gap-2 text-xs text-gray-500">
                <Link href="/" className="hover:text-gray-900 transition">হোম</Link>
                <span>›</span>
                <span
                  onClick={() => {
                    router.push(`/products/${singleProduct.category}`);
                  }}
                  className="hover:text-gray-900 transition cursor-pointer"
                >
                  {singleProduct.categoryNameBn || singleProduct.category}
                </span>
                <span>›</span>
                <span className="text-gray-800 font-medium">{singleProduct.nameBn}</span>
              </nav>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl shrink-0 border border-gray-100">
                    {singleProduct.image || singleProduct.categoryIcon || '🍚'}
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {singleProduct.nameBn}
                    </h1>
                    <p className="text-xs text-gray-400 mt-1">
                      প্রতি {singleProduct.unit} • {singleProduct.categoryNameBn || singleProduct.category}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 sm:bg-transparent p-4 sm:p-0 rounded-xl flex sm:flex-col items-between sm:items-end justify-between text-right">
                  <p className="text-xs text-gray-400 font-medium">আজকের দাম</p>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900">{toBanglaDigits(singleProduct.today)}</span>
                    <span className="text-xs text-gray-500">টাকা / {singleProduct.unit}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-base font-bold text-gray-900">দামের সারসংক্ষেপ</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-1">
                    <p className="text-xs font-medium text-gray-400">সর্বনিম্ন দাম</p>
                    <p className="text-xl font-bold text-emerald-600">
                      {toBanglaDigits(singleProduct.minPrice || 59)} টাকা
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-1">
                    <p className="text-xs font-medium text-gray-400">সর্বোচ্চ দাম</p>
                    <p className="text-xl font-bold text-red-500">
                      {toBanglaDigits(singleProduct.maxPrice || 76)} টাকা
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-1">
                    <p className="text-xs font-medium text-gray-400">গড় দাম</p>
                    <p className="text-xl font-bold text-emerald-600">
                      {toBanglaDigits(singleProduct.avgPrice || singleProduct.today)} টাকা
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-4">
                <h2 className="text-base font-bold text-gray-900">বাজারভিত্তিক আজকের দাম</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm text-gray-600">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-medium">
                        <th className="pb-3 font-medium">বাজার</th>
                        <th className="pb-3 font-medium">বিভাগ</th>
                        <th className="pb-3 font-medium text-center">সর্বনিম্ন</th>
                        <th className="pb-3 font-medium text-center">সর্বোচ্চ</th>
                        <th className="pb-3 font-medium text-right">গড়</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {(singleProduct.markets && singleProduct.markets.length > 0 ? singleProduct.markets : [
                        { market: 'স্মার্ট বাজার', division: 'ময়মনসিংহ', min: 59, max: 62, avg: 61 },
                        { market: 'সফোর বাজার', division: 'রাজশাহী', min: 60, max: 66, avg: 60 },
                        { market: 'বাজারহাট', division: 'খুলনা', min: 60, max: 67, avg: 63.5 }
                      ]).map((m, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition">
                          <td className="py-3.5 font-bold text-gray-900">{m.market}</td>
                          <td className="py-3.5 text-gray-500">{m.division}</td>
                          <td className="py-3.5 text-center font-semibold text-gray-700">{toBanglaDigits(m.min)} টাকা</td>
                          <td className="py-3.5 text-center font-semibold text-gray-700">{toBanglaDigits(m.max)} টাকা</td>
                          <td className="py-3.5 text-right font-bold text-gray-900">{toBanglaDigits(m.avg || m.min)} টাকা</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <Footer />
    </div>
  );
}