'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/componenets/Navbar';
import Footer from '@/componenets/Footer';
import toast, { Toaster } from 'react-hot-toast';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showGithubModal, setShowGithubModal] = useState(false);
  const router = useRouter();

  // সফল রেজিস্টার করার পর লগইন পেজে নিয়ে যাওয়া
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('পাসওয়ার্ড মিলছে না!');
      return;
    }

    if (password.length < 8) {
      toast.error('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে!');
      return;
    }

    setLoading(true);

    try {
      const existingUsers = JSON.parse(localStorage.getItem('bazarRegisteredUsers') || '[]');
      const userExists = existingUsers.find((user: any) => user.email === email);

      if (userExists) {
        toast.error('এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট তৈরি করা হয়েছে!');
        setLoading(false);
        setTimeout(() => {
          router.push('/signin');
        }, 1000);
        return;
      }

      // নতুন ইউজার লোকালস্টোরেজে সেভ করা
      const newUser = { name, email, password };
      existingUsers.push(newUser);
      localStorage.setItem('bazarRegisteredUsers', JSON.stringify(existingUsers));

      toast.success('অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! দয়া করে লগইন করুন।');
      
      // অ্যাসাইনমেন্ট রিকোয়ারমেন্ট অনুযায়ী রেজিস্ট্রেশন শেষে লগইন পেজে রিডাইরেক্ট
      setTimeout(() => {
        router.push('/signin');
      }, 1000);
    } catch (err) {
      console.error('Sign-Up Error:', err);
      toast.error('অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে!');
      setLoading(false);
    }
  };

  // সোশ্যাল সাইন-ইনে সরাসরি হোমপেজে অথেন্টিকেট করা
  const handleSocialAuth = (userName: string, userEmail: string) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('bazarUserName', userName);
    localStorage.setItem('bazarUserEmail', userEmail);
    toast.success('সফলভাবে সাইন ইন হয়েছে!');
    setTimeout(() => {
      window.location.href = '/';
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-[#F4F8F5] flex flex-col justify-between font-sans">
      <Toaster position="top-center" />

      <div className="sticky top-0 z-50 bg-white">
        <Navbar />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            অ্যাকাউন্ট তৈরি করুন
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
          </p>
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5">
                নাম
              </label>
              <input
                type="text"
                placeholder="যেমন: রহিম উদ্দিন"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#009A49] transition"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5">
                ইমেইল
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#009A49] transition"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5">
                পাসওয়ার্ড
              </label>
              <input
                type="password"
                placeholder="কমপক্ষে ৮ অক্ষর"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#009A49] transition"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5">
                পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <input
                type="password"
                placeholder="আবার লিখুন"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#009A49] transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#009A49] hover:bg-[#00813d] text-white font-bold rounded-xl shadow-md shadow-[#009A49]/20 transition active:scale-[0.99] text-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? 'প্রসেসিং হচ্ছে...' : 'অ্যাকাউন্ট তৈরি করুন'}
            </button>
          </form>

          <div className="relative my-6 flex items-center justify-center">
            <div className="w-full border-t border-gray-200"></div>
            <span className="bg-white px-3 text-xs text-gray-500 absolute font-medium">
              অথবা
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setShowGoogleModal(true)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs sm:text-sm font-bold text-gray-800 transition cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"/>
              </svg>
              <span>Google দিয়ে চালিয়ে যান</span>
            </button>

            <button
              type="button"
              onClick={() => setShowGithubModal(true)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs sm:text-sm font-bold text-gray-800 transition cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0 fill-current text-gray-900" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub দিয়ে চালিয়ে যান</span>
            </button>
          </div>

          <div className="text-center text-xs text-gray-600 font-medium">
            অ্যাকাউন্ট আছে?{' '}
            <Link href="/signin" className="text-[#009A49] font-bold hover:underline">
              সাইন ইন করুন
            </Link>
          </div>
        </div>

        {/* গুগল অ্যাকাউন্ট সিলেকশন পপআপ */}
        {showGoogleModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-6 border border-gray-100 animate-in fade-in zoom-in duration-200">
              <div className="text-center mb-6">
                <div className="inline-flex p-3 bg-blue-50 rounded-full mb-2">
                  <svg className="w-8 h-8" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"/>
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Sign in with Google</h2>
                <p className="text-xs text-gray-500 mt-1">choose an account to continue to বাজার দর</p>
              </div>

              <div className="space-y-3 mb-6">
                <div 
                  onClick={() => handleSocialAuth('আব্দুল মোমিন', '35abdulmomin@gmail.com')}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-gray-200 hover:border-[#009A49] hover:bg-emerald-50/40 cursor-pointer transition group"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                    অ
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 group-hover:text-emerald-800">আব্দুল মোমিন</p>
                    <p className="text-xs text-gray-500 truncate">35abdulmomin@gmail.com</p>
                  </div>
                </div>

                <div 
                  onClick={() => {
                    const customEmail = prompt("আপনার জিমেইল (Gmail) অ্যাকাউন্টটি লিখুন:", "mygmail@gmail.com");
                    if (customEmail) {
                      const customName = prompt("আপনার নামটি লিখুন:", customEmail.split('@')[0]) || "Google User";
                      handleSocialAuth(customName, customEmail);
                    }
                  }}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-dashed border-gray-300 hover:border-[#009A49] hover:bg-gray-50 cursor-pointer transition"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 font-bold flex items-center justify-center text-lg shrink-0">
                    +
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800">Use another account</p>
                    <p className="text-xs text-gray-500">আপনার নিজস্ব জিমেইল দিয়ে সাইন আপ করুন</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowGoogleModal(false)}
                className="w-full py-2.5 text-xs font-bold text-gray-500 hover:text-gray-800 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* গিটহাব অ্যাকাউন্ট সিলেকশন পপআপ */}
        {showGithubModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-6 border border-gray-100 animate-in fade-in zoom-in duration-200">
              <div className="text-center mb-6">
                <div className="inline-flex p-3 bg-gray-100 rounded-full mb-2">
                  <svg className="w-8 h-8 fill-current text-gray-900" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Sign in to GitHub</h2>
                <p className="text-xs text-gray-500 mt-1">Authorize <b>বাজার দর</b> to access your GitHub account</p>
              </div>

              <div className="space-y-3 mb-6">
                <div 
                  onClick={() => handleSocialAuth('35abdulmomin-byte', '35abdulmomin@gmail.com')}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-gray-200 hover:border-gray-900 hover:bg-gray-50 cursor-pointer transition group"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-900 text-white font-bold flex items-center justify-center text-sm shrink-0">
                    35
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">35abdulmomin-byte</p>
                    <p className="text-xs text-gray-500 truncate">35abdulmomin@gmail.com</p>
                  </div>
                </div>

                <div 
                  onClick={() => {
                    const customUsername = prompt("আপনার GitHub ইউজারনেম/ইমেইল লিখুন:", "githubuser");
                    if (customUsername) {
                      const customEmail = customUsername.includes('@') ? customUsername : `${customUsername}@users.noreply.github.com`;
                      handleSocialAuth(customUsername, customEmail);
                    }
                  }}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-dashed border-gray-300 hover:border-gray-900 hover:bg-gray-50 cursor-pointer transition"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 font-bold flex items-center justify-center text-lg shrink-0">
                    +
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800">Switch account</p>
                    <p className="text-xs text-gray-500">অন্যান্য GitHub আইডি দিয়ে প্রবেশ করুন</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowGithubModal(false)}
                className="w-full py-2.5 text-xs font-bold text-gray-500 hover:text-gray-800 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 mb-4">
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-800 transition font-medium">
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}