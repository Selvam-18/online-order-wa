
"use client";

import { useEffect, useMemo, useState } from "react";

type Dish = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
};

const photo = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&q=85`;

const categories = [
  "All",
  "Main Course",
  "Desserts",
  "Ice Cream",
  "Juices",
  "Specials",
];

const dishes: Dish[] = [
  // MAIN COURSE
  { id: 1, name: "Los Pollos Fried Chicken", price: 249, category: "Main Course", image: photo("photo-1626082927389-6cd097cdc6ec") },
  { id: 2, name: "Heisenburger", price: 199, category: "Main Course", image: photo("photo-1568901346375-23c9450c58cd") },
  { id: 3, name: "Gus's Grilled Chicken", price: 279, category: "Main Course", image: photo("photo-1532550907401-a500c9a57435") },
  { id: 4, name: "Breaking Bad Burrito", price: 189, category: "Main Course", image: photo("photo-1565299585323-38d6b0865b47") },
  { id: 5, name: "Pollos Loaded Fries", price: 159, category: "Main Course", image: photo("photo-1573080496219-bb080dd4f877") },

  // DESSERTS
  { id: 6, name: "Blue Sky Brownie", price: 129, category: "Desserts", image: photo("photo-1606313564200-e75d5e30476c") },
  { id: 7, name: "Saul's Cheesecake", price: 149, category: "Desserts", image: photo("photo-1533134242443-d4fd215305ad") },
  { id: 8, name: "Pink Teddy Cupcake", price: 99, category: "Desserts", image: photo("photo-1486427944299-d1955d23e34d") },
  { id: 9, name: "Los Pollos Churros", price: 119, category: "Desserts", image: photo("photo-1624371414361-e670edf4898d") },
  { id: 10, name: "Desert Cheesecake", price: 139, category: "Desserts", image: photo("photo-1578985545062-69928b1d9587") },

  // ICE CREAM
  { id: 11, name: "Blue Crystal Scoop", price: 89, category: "Ice Cream", image: photo("photo-1563805042-7684c019e1cb") },
  { id: 12, name: "Vanilla Sky", price: 79, category: "Ice Cream", image: photo("photo-1501446529957-6226bd447c46") },
  { id: 13, name: "Chocolate Empire", price: 99, category: "Ice Cream", image: photo("photo-1560008581-09826d1de69e") },
  { id: 14, name: "Pinkman Strawberry", price: 89, category: "Ice Cream", image: photo("photo-1497034825429-c343d7c6a68f") },
  { id: 15, name: "Midnight Sundae", price: 129, category: "Ice Cream", image: photo("photo-1563805042-7684c019e1cb") },

  // JUICES
  { id: 16, name: "Blue Sky Cooler", price: 89, category: "Juices", image: photo("photo-1513558161293-cdaf765edfd7") },
  { id: 17, name: "Pinkman Punch", price: 99, category: "Juices", image: photo("photo-1546173159-315724a31696") },
  { id: 18, name: "Desert Lemonade", price: 69, category: "Juices", image: photo("photo-1513558161293-cdaf765edfd7") },
  { id: 19, name: "Green Lab Detox", price: 109, category: "Juices", image: photo("photo-1534353473418-4cfa6c56fd38") },
  { id: 20, name: "Orange Sunrise", price: 79, category: "Juices", image: photo("photo-1600271886742-f049cd451bba") },

  // SPECIALS
  { id: 21, name: "Heisenberg Combo", price: 399, category: "Specials", image: photo("photo-1550547660-d9450f859349") },
  { id: 22, name: "The One Who Knocks", price: 349, category: "Specials", image: photo("photo-1568901346375-23c9450c58cd") },
  { id: 23, name: "Better Call Saul Meal", price: 329, category: "Specials", image: photo("photo-1547592180-85f173990554") },
  { id: 24, name: "Los Pollos Family Box", price: 599, category: "Specials", image: photo("photo-1626082927389-6cd097cdc6ec") },
  { id: 25, name: "Say My Name Feast", price: 449, category: "Specials", image: photo("photo-1555939594-58d7cb561ad1") },
];

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    apiCall()
  }, [])

  async function apiCall() {
    try{
      const res = await fetch('/api')
      const data = await res.json();
      console.log(data, 'result')
    } catch(e) {

    }
  }

  const visibleDishes = useMemo(
    () =>
      dishes.filter(
        (dish) =>
          (activeCategory === "All" ||
            dish.category === activeCategory) &&
          dish.name.toLowerCase().includes(search.toLowerCase())
      ),
    [activeCategory, search]
  );

  const cartItems = dishes.filter((dish) => (cart[dish.id] ?? 0) > 0);

  const itemCount = Object.values(cart).reduce(
    (total, quantity) => total + quantity,
    0
  );

  const total = cartItems.reduce(
    (sum, dish) => sum + dish.price * cart[dish.id],
    0
  );

  function changeQuantity(id: number, change: number) {
    setCart((current) => {
      const next = { ...current };
      const quantity = (next[id] ?? 0) + change;

      if (quantity <= 0) delete next[id];
      else next[id] = quantity;

      return next;
    });
  }

  const handleProceed = async () => {
  const orderData = {
    items: dishes
      .filter((dish) => (cart[dish.id] ?? 0) > 0)
      .map((dish) => ({
        id: dish.id,
        name: dish.name,
        quantity: cart[dish.id],
        price: dish.price,
        subtotal: dish.price * cart[dish.id],
      })),

    total: dishes.reduce(
      (sum, dish) =>
        sum + dish.price * (cart[dish.id] ?? 0),
      0
    ),

    currency: "INR",
  };

  try{
    const res = await fetch('https://localhost:3001/api/whatsapp/bot-flows/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })
    
    console.log(res.json(), 'res')
  }catch(e) {

  }
  console.log("Final Order Data:", orderData);
};

  return (
    <main className="min-h-screen bg-[#f8f5eb] text-[#20231d]">
      {/* Top announcement */}
      <div className="bg-[#20231d] px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-[#f3d33d] sm:text-xs">
        Fresh. Fast. Unforgettable. — Albuquerque, NM
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-black/10 bg-[#f8f5eb]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <button
            onClick={() => {
              setActiveCategory("All");
              setSearch("");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-3 text-left"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#20231d] bg-[#f3d33d] text-xs font-black">
              LP
            </div>
            <div>
              <p className="text-sm font-black uppercase leading-tight tracking-tight sm:text-base">
                Los Pollos
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em]">
                Hermanos
              </p>
            </div>
          </button>

          <button
            onClick={() => setCartOpen(true)}
            className="flex items-center gap-2 rounded-full bg-[#20231d] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#3d4435] active:scale-95"
          >
            <span>Cart</span>
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#f3d33d] px-1 text-xs font-black text-black">
              {itemCount}
            </span>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#20231d] text-white">
        <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full border-[45px] border-[#f3d33d]/10 sm:right-0 sm:h-96 sm:w-96" />
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-14 sm:px-8 sm:py-20 md:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-[fadeUp_.6s_ease-out_both]">
            <p className="mb-5 inline-flex border border-[#f3d33d]/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#f3d33d]">
              The original Albuquerque classic
            </p>
            <h1 className="max-w-xl text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-7xl">
              Los Pollos
              <span className="block text-[#f3d33d]">Hermanos.</span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/65 sm:text-base">
              Good food. No half measures. Find your next favourite from
              our kitchen.
            </p>
            <button
              onClick={() =>
                document
                  .getElementById("menu")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="mt-8 bg-[#f3d33d] px-6 py-3.5 text-xs font-black uppercase tracking-widest text-[#20231d] transition hover:bg-white active:scale-95"
            >
              Explore the menu <span className="ml-2">↘</span>
            </button>
          </div>

          <div className="relative animate-[fadeUp_.8s_ease-out_both]">
            <div className="absolute -inset-3 rotate-3 border border-[#f3d33d]/50" />
            <img
              src={photo("photo-1626082927389-6cd097cdc6ec")}
              alt="Crispy fried chicken"
              className="relative h-64 w-full object-cover sm:h-80"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-14">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f3d33d]">
                Our signature
              </p>
              <p className="mt-1 text-xl font-black uppercase">
                The taste of the desert
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8b7b29]">
              Prepared with precision
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight sm:text-4xl">
              The Menu<span className="text-[#d5b719]">.</span>
            </h2>
          </div>

          <label className="flex items-center gap-3 border-b border-black/25 py-2">
            <span className="text-sm">⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find something good..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-black/40 sm:w-56"
            />
          </label>
        </div>

        {/* Category tabs */}
        <div className="no-scrollbar mb-9 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-bold transition-all duration-200 ${
                activeCategory === category
                  ? "border-[#20231d] bg-[#20231d] text-[#f3d33d]"
                  : "border-black/15 bg-transparent hover:border-black/50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
          {visibleDishes.length} items / Made to order
        </p>

        {/* Dish grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
          {visibleDishes.map((dish, index) => (
            <article
              key={dish.id}
              className="group animate-[fadeUp_.4s_ease-out_both]"
              style={{ animationDelay: `${Math.min(index * 45, 300)}ms` }}
            >
              <div className="relative overflow-hidden bg-[#e9e4d7]">
                <img
                  src={dish.image}
                  alt={dish.name}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-2 top-2 bg-[#f8f5eb]/95 px-2 py-1 text-[9px] font-black uppercase tracking-wider sm:left-3 sm:top-3">
                  {dish.category}
                </span>
                {(cart[dish.id] ?? 0) > 0 && (
                  <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#f3d33d] text-xs font-black">
                    {cart[dish.id]}
                  </span>
                )}
              </div>

              <div className="pt-3">
                <h3 className="min-h-10 text-sm font-black leading-5 sm:text-base">
                  {dish.name}
                </h3>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-sm font-bold">{money(dish.price)}</span>
                  <button
                    onClick={() => changeQuantity(dish.id, 1)}
                    aria-label={`Add ${dish.name} to cart`}
                    className="flex h-9 w-9 items-center justify-center border border-[#20231d] text-lg transition hover:bg-[#f3d33d] active:scale-90 sm:h-10 sm:w-10"
                  >
                    +
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {visibleDishes.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg font-black uppercase">Nothing found.</p>
            <p className="mt-2 text-sm text-black/50">
              Try another search or category.
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10 bg-[#eee9dc]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-xs font-black uppercase tracking-widest">
            Los Pollos Hermanos
          </p>
          <p className="text-[10px] uppercase tracking-widest text-black/50">
            Taste the difference. Albuquerque, New Mexico.
          </p>
        </div>
      </footer>

      {/* Cart overlay */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]"
          onClick={() => setCartOpen(false)}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 right-0 top-0 flex w-full max-w-md animate-[slideIn_.25s_ease-out] flex-col bg-[#f8f5eb] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-5 sm:px-7">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8b7b29]">
                  Your selection
                </p>
                <h2 className="mt-1 text-2xl font-black uppercase">
                  The Cart<span className="text-[#d5b719]">.</span>
                </h2>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
                className="flex h-10 w-10 items-center justify-center border border-black/15 text-xl transition hover:bg-[#f3d33d]"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-7">
              {cartItems.length === 0 ? (
                <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eee9dc] text-2xl">
                    —
                  </div>
                  <p className="mt-4 font-black uppercase">Nothing in the cart</p>
                  <p className="mt-2 text-sm text-black/50">
                    Your next favourite is waiting.
                  </p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="mt-5 bg-[#20231d] px-5 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#3d4435]"
                  >
                    Browse menu
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-black/10">
                  {cartItems.map((dish) => (
                    <div key={dish.id} className="flex gap-4 py-4">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="h-20 w-20 shrink-0 object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-black">{dish.name}</h3>
                        <p className="mt-1 text-xs text-black/55">
                          {money(dish.price)} each
                        </p>
                        <div className="mt-3 flex items-center gap-3">
                          <button
                            onClick={() => changeQuantity(dish.id, -1)}
                            aria-label={`Remove one ${dish.name}`}
                            className="flex h-7 w-7 items-center justify-center border border-black/20 hover:bg-[#f3d33d]"
                          >
                            −
                          </button>
                          <span className="w-4 text-center text-sm font-bold">
                            {cart[dish.id]}
                          </span>
                          <button
                            onClick={() => changeQuantity(dish.id, 1)}
                            aria-label={`Add one ${dish.name}`}
                            className="flex h-7 w-7 items-center justify-center border border-black/20 hover:bg-[#f3d33d]"
                          >
                            +
                          </button>
                          <button
                            onClick={() =>
                              setCart((current) => {
                                const next = { ...current };
                                delete next[dish.id];
                                return next;
                              })
                            }
                            className="ml-auto text-[10px] font-bold uppercase tracking-wider text-red-700 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <p className="shrink-0 text-sm font-black">
                        {money(dish.price * cart[dish.id])}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-black/10 bg-[#eee9dc] px-5 py-5 sm:px-7">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-black/60">Items ({itemCount})</span>
                  <span>{money(total)}</span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-black/15 pt-4">
                  <span className="text-sm font-black uppercase tracking-wider">
                    Total
                  </span>
                  <span className="text-2xl font-black">{money(total)}</span>
                </div>
                <button
                  onClick={handleProceed}
                  className="mt-5 w-full bg-[#20231d] px-5 py-4 text-xs font-black uppercase tracking-[0.2em] text-[#f3d33d] transition hover:bg-[#3d4435] active:scale-[0.99]"
                >
                  Proceed to order →
                </button>
                <p className="mt-3 text-center text-[10px] text-black/45">
                  Taxes and delivery charges are not included.
                </p>
              </div>
            )}
          </aside>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(24px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        html {
          scroll-behavior: smooth;
        }

        .no-scrollbar {
          scrollbar-width: none;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </main>
  );
}
