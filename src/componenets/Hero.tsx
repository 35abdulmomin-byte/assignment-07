'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Hero() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<string>('');
  const router = useRouter();

  // ডাইনামিক তারিখ তৈরির কোড
  useEffect(() => {
    const today = new Date();
    
    // বাংলায় বার পাওয়ার জন্য
    const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
    const dayName = days[today.getDay()];

    // বাংলায় মাস পাওয়ার জন্য
    const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    const monthName = months[today.getMonth()];

    const dayNumber = today.getDate();
    const yearNumber = today.getFullYear();

    // ইংরেজি সংখ্যাকে বাংলা সংখ্যায় রূপান্তর করার ফাংশন
    const toBanglaDigits = (num: number | string) => {
      const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      return String(num).replace(/\d/g, (digit) => banglaDigits[parseInt(digit)]);
    };

    const formattedDate = `${dayName}, ${toBanglaDigits(dayNumber)} ${monthName}, ${toBanglaDigits(yearNumber)}`;
    setCurrentDate(formattedDate);
  }, []);

  const handleActionClick = () => {
    if (!isLoggedIn) {
      router.push('/signin');
    } else {
      const element = document.getElementById('all-products');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-gray-100 shadow-sm flex flex-col-reverse lg:flex-row items-center justify-between gap-8">
        
        {/* বাম পাশের কনটেন্ট */}
        <div className="w-full lg:w-3/5 flex flex-col items-start space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-[#E6F5EC] text-[#009A49] text-xs sm:text-sm font-semibold">
            {currentDate || 'লোড হচ্ছে...'}
          </span>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          <div className="pt-2">
            <button
              onClick={handleActionClick}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#009A49] hover:bg-[#00813d] text-white font-semibold text-sm sm:text-base shadow-md shadow-[#009A49]/20 transition-transform active:scale-95 cursor-pointer"
            >
              সব পণ্য দেখুন
            </button>
          </div>
        </div>

        {/* ডান পাশের ঝুড়ির ছবি */}
        <div 
          onClick={handleActionClick} 
          className="w-full lg:w-2/5 flex justify-center lg:justify-end cursor-pointer"
        >
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
            <Image
              src="/bazar-hero.png"
              alt="বাজার দর ঝুড়ি"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
}