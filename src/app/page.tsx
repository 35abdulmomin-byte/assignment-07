'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/componenets/Navbar';
import Hero from '@/componenets/Hero';
import AllProducts from '@/componenets/AllProducts';
import Footer from '@/componenets/Footer';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    // Globale jekono product ba category link-e click handle kora
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      // Jodi link-ti kono product ba category page-er hoy (/products/...)
      if (href && href.startsWith('/products/')) {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        
        if (isLoggedIn !== 'true') {
          e.preventDefault(); // Default navigation thamiye debe
          window.location.href = `/signin?redirectUrl=${encodeURIComponent(href)}`;
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F6F8F6]">
      <div>
        <Navbar 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <Hero />

        <AllProducts selectedCategory={selectedCategory} />
      </div>

      <Footer />
    </div>
  );
}