import { ROUTES } from "@/lib";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <p className="font-sans text-[0.65rem] font-light tracking-widest-3 uppercase text-muted mb-8">
        Fresh flavors, crafted with care
      </p>
      <h1 className="font-serif text-7xl sm:text-8xl lg:text-9xl font-light leading-[0.9] tracking-tight text-center text-foreground">
        Restaurant
      </h1>
      <div className="w-px h-16 bg-accent mt-8 mb-10" />
      <nav className="flex gap-6">
        <a
          href={ROUTES.MENU}
          className="inline-flex items-center justify-center font-sans text-xs font-medium tracking-widest-2 uppercase bg-foreground text-background px-10 py-4 hover:bg-accent transition-colors duration-300"
        >
          Menu
        </a>
        <a
          href={ROUTES.CART}
          className="inline-flex items-center justify-center font-sans text-xs font-medium tracking-widest-2 uppercase border border-border text-foreground px-10 py-4 hover:border-accent hover:text-accent transition-all duration-300"
        >
          Cart
        </a>
      </nav>
    </div>
  );
}
