# BazarDor (বাজার দর)

A modern and dynamic web application designed to track essential market commodity prices, daily price fluctuations, and market-by-market comparisons seamlessly.

---

## 🚀 Key Features

* **Real-Time Market Price Tracking:** View current market prices and daily price variations (increases or decreases) for essential commodities like rice, lentils, oil, vegetables, fish, meat, and spices.
* **Secure Authentication & Protected Routes:** Restricts access to detailed product pages to authenticated users only, enforced through a custom client-side authentication guard.
* **Smart Redirection Mechanism:** Automatically redirects unauthenticated users to the sign-in page and routes them back to their intended product page immediately after logging in.
* **Market-Specific Price Comparison:** Interactive tables displaying minimum, maximum, and average prices across different local markets and divisions.
* **Dynamic Bilingual Interface:** Responsive user interface featuring Bangla digit formatting and category-based filtering.

---

## 🛠️ Technologies Used

* **Framework:** Next.js (App Router)
* **Library:** React.js
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **State & Storage:** React Hooks, LocalStorage
* **Notifications:** React Hot Toast

---

## ⚙️ Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev