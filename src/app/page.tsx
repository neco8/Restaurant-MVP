export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-12">
        Restaurant
      </h1>
      <nav className="flex gap-4">
        <a
          href="/menu"
          className="inline-flex items-center justify-center rounded-lg bg-stone-900 text-white px-8 py-3 text-lg font-medium shadow-sm hover:bg-stone-800 transition-colors dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
        >
          Menu
        </a>
        <a
          href="/cart"
          className="inline-flex items-center justify-center rounded-lg border-2 border-stone-300 px-8 py-3 text-lg font-medium hover:border-stone-400 hover:bg-stone-100 transition-colors dark:border-stone-600 dark:hover:border-stone-500 dark:hover:bg-stone-800"
        >
          Cart
        </a>
      </nav>
    </div>
  );
}
