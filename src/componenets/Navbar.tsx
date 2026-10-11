'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface Market {
  market: string;
  division: string;
  min: number;
  max: number;
}

interface Product {
  id: number | string;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday?: number;
  lastWeek?: number;
  lastMonth?: number;
  change?: {
    dir: 'up' | 'down' | string;
    pct: number;
  };
  markets?: Market[];
}

interface CategoryItem {
  slug: string;
  nameBn: string;
  icon: string;
}

interface NavbarProps {
  selectedCategory?: string;
  onSelectCategory?: (categorySlug: string) => void;
}

export default function Navbar({
  selectedCategory = 'all',
  onSelectCategory,
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategory);
  const [products, setProducts] = useState<Product[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [currentDateBn, setCurrentDateBn] = useState<string>('');

  useEffect(() => {
    setActiveCategory(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    // ডায়নামিক আজকের বাংলা তারিখ জেনারেট করা
    const today = new Date();
    const formattedDate = new Intl.DateTimeFormat('bn-BD', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(today);

    setCurrentDateBn(formattedDate);

    // LocalStorage থেকে ইউজার নেম চেক করা
    const name = localStorage.getItem('bazarUserName');
    if (name) {
      setUserName(name);
    }

    let isMounted = true;

    async function fetchProducts() {
      try {
        const res = await fetch('/api/bazardor/products');
        if (!res.ok) return;

        const data = await res.json();
        const prodList: Product[] = Array.isArray(data) ? data : [];

        if (isMounted && prodList.length > 0) {
          setProducts(prodList);

          const uniqueCatsMap = new Map<string, CategoryItem>();

          uniqueCatsMap.set('all', {
            slug: 'all',
            nameBn: 'সব',
            icon: '🛍️',
          });

          prodList.forEach((item) => {
            if (item.category && !uniqueCatsMap.has(item.category)) {
              uniqueCatsMap.set(item.category, {
                slug: item.category,
                nameBn: item.categoryNameBn || item.category,
                icon: item.categoryIcon || '🛒',
              });
            }
          });

          setCategories(Array.from(uniqueCatsMap.values()));
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCategoryClick = (slug: string) => {
    setActiveCategory(slug);
    
    if (onSelectCategory) {
      onSelectCategory(slug);
    }

    // নেভবারে ক্যাটাগরিতে ক্লিক করলে নির্দিষ্ট ক্যাটাগরি পেজে নেভিগেট করা
    if (slug === 'all') {
      router.push('/');
    } else {
      router.push(`/products/${slug}`);
    }
  };

  return (
    <header className="w-full bg-white font-sans sticky top-0 z-50 shadow-xs">
      {/* Row 1: Header Top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between border-b border-gray-100">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 relative rounded-xl bg-[#009A49] flex items-center justify-center shrink-0">
            <Image
              src="/logo-icon.png"
              alt="বাজার দর"
              width={36}
              height={36}
              className="object-contain p-1"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
              বাজার দর
            </span>
            <span className="text-xs text-gray-500">
              {currentDateBn || '১১ অক্টোবর, ২০২৬'}
            </span>
          </div>
        </Link>

        {/* Profile icon/name অথবা Sign In & Sign Up */}
        <div className="flex items-center gap-3">
          {userName ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 py-1.5 px-3 rounded-full hover:bg-gray-50 border border-gray-100 transition cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#009A49] text-white flex items-center justify-center font-bold text-sm overflow-hidden border border-gray-200">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-bold text-gray-800 hidden sm:inline">
                {userName.split(' ')[0]}
              </span>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/signin"
                className="text-sm font-bold text-gray-900 hover:text-[#009A49] transition px-2 py-1"
              >
                সাইন ইন
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2.5 text-sm font-bold text-white bg-[#009A49] hover:bg-[#00813d] rounded-xl shadow-md shadow-[#009A49]/20 transition active:scale-95 inline-block"
              >
                সাইন আপ
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Category Filter Bar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 overflow-x-auto no-scrollbar bg-white">
        <ul className="flex items-center gap-2 sm:gap-3 justify-start sm:justify-center min-w-max">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug;

            return (
              <li key={cat.slug}>
                <button
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-[#E6F5EC] text-[#009A49] font-bold border border-[#009A49]/20 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.nameBn}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>


      <div className="bg-[#F8FAFC] border-t border-b border-gray-200 py-2 overflow-hidden select-none">
        <div className="animate-marquee flex items-center whitespace-nowrap">
          {products.length > 0 &&
            [...products, ...products].map((item, index) => {
              const isUp = item.change?.dir === 'up';
              const pct = item.change?.pct;

              return (
                <Link
                  key={`ticker-${item.id}-${index}`}
                  href={`/products/${item.slug || item.id}`}
                  className="inline-flex items-center gap-2.5 px-6 py-1 border-r border-gray-200 text-sm text-gray-700 shrink-0 hover:bg-gray-100 transition cursor-pointer"
                >
                  <span className="text-base leading-none">
                    {item.image || item.categoryIcon || '🛒'}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {item.nameBn}
                  </span>
                  <span className="text-gray-600">
                    ৳{item.today}/{item.unit}
                  </span>

                  {pct !== undefined && pct !== 0 && (
                    <span
                      className={`inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded ${
                        isUp
                          ? 'text-red-600 bg-red-50 border border-red-200'
                          : 'text-emerald-600 bg-emerald-50 border border-emerald-200'
                      }`}
                    >
                      <span className="text-[10px]">{isUp ? '▲' : '▼'}</span>
                      <span>{Math.abs(pct)}%</span>
                    </span>
                  )}
                </Link>
              );
            })}
        </div>
      </div>
    </header>
  );
}