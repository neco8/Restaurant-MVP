import { ROUTES } from "@/lib";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tighter mb-3 bg-gradient-to-r from-amber-700 via-amber-600 to-orange-500 bg-clip-text text-transparent dark:from-amber-400 dark:via-amber-300 dark:to-orange-300">
        Restaurant
      </h1>
      <nav className="flex gap-4 mt-10">
        <a
          href={ROUTES.MENU}
          className="inline-flex items-center justify-center rounded-full bg-amber-600 text-white px-8 py-3 text-lg font-semibold shadow-lg shadow-amber-600/20 hover:bg-amber-700 hover:shadow-amber-700/25 active:scale-[0.98] transition-all dark:bg-amber-500 dark:text-stone-950 dark:hover:bg-amber-400 dark:shadow-amber-500/20"
        >
          Menu
        </a>
        <a
          href={ROUTES.CART}
          className="inline-flex items-center justify-center rounded-full border-2 border-stone-300 px-8 py-3 text-lg font-semibold hover:border-amber-500 hover:text-amber-700 hover:bg-amber-50 active:scale-[0.98] transition-all dark:border-stone-600 dark:hover:border-amber-400 dark:hover:text-amber-400 dark:hover:bg-amber-400/5"
        >
          Cart
        </a>
      </nav>
    </div>
  );
}
