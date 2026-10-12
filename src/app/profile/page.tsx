'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/componenets/Navbar';
import Footer from '@/componenets/Footer';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedName = localStorage.getItem('bazarUserName');
    const savedEmail = localStorage.getItem('bazarUserEmail');

    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('bazarUserName', name);
    alert('প্রোফাইল সফলভাবে আপডেট করা হয়েছে!');
  };

  const handleSignOut = () => {
    // ১. মিডলওয়্যারের কুকি সম্পূর্ণ মুছে ফেলা
    document.cookie = "isLoggedIn=false; path=/; max-age=0;";
    
    // ২. লোকাল স্টোরেজ থেকে সব তথ্য পরিষ্কার করা
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('bazarUserName');
    localStorage.removeItem('bazarUserEmail');
    
    // ৩. সেশন ক্লিয়ার করে সরাসরি পেজ রিফ্রেশসহ সাইন ইন পেজে পাঠানো
    window.location.replace('/signin');
  };

  return (
    <div className="min-h-screen bg-[#F4F8F5] flex flex-col justify-between font-sans">
      {/* ফিক্সড নেভবার */}
      <div className="sticky top-0 z-50 bg-white">
        <Navbar />
      </div>

      {/* মূল কন্টেন্ট */}
      <main className="max-w-4xl mx-auto w-full px-4 py-10 space-y-8 flex-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">আমার প্রোফাইল</h1>
          <p className="text-sm text-gray-500 mt-1">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন ও পরিবর্তন করুন।</p>
        </div>

        {/* ইউজার কার্ড */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden relative border-2 border-[#009A49] flex items-center justify-center text-xl font-bold text-gray-700">
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{name || 'ব্যবহারকারী'}</h2>
              <p className="text-sm text-gray-500">{email || 'email@example.com'}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 font-bold text-xs sm:text-sm hover:bg-red-100 transition cursor-pointer"
          >
            <span>←</span>
            <span>সাইন আউট</span>
          </button>
        </div>

        {/* তথ্য আপডেট ফর্ম */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-gray-900">তথ্য</h3>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5">
                নাম
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-[#009A49] transition"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5">
                ইমেইল (পরিবর্তনযোগ্য নয়)
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#009A49] hover:bg-[#00813d] text-white font-bold rounded-xl shadow-md shadow-[#009A49]/20 transition active:scale-[0.99] text-sm cursor-pointer"
            >
              আপডেট
            </button>
          </form>
        </div>
      </main>

      {/* ফিক্সড ফুটার */}
      <Footer />
    </div>
  );
}