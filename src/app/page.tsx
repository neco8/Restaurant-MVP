import { ROUTES } from "@/lib";
import { SIGNATURE_DISHES } from "@/lib/signatureDishes";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <p className="font-sans text-[0.6rem] font-light tracking-widest-3 uppercase text-muted mb-6">
          Classical Japanese-Chinese Cuisine
        </p>
        <p className="font-serif text-4xl sm:text-5xl font-light tracking-[0.3em] text-accent mb-2">
          蓮華
        </p>
        <h1 className="font-serif text-7xl sm:text-8xl lg:text-9xl font-light leading-[0.9] tracking-tight text-center text-foreground">
          RENGE
        </h1>
        <div className="w-px h-16 bg-accent mt-8 mb-6" />
        <p className="font-serif text-sm font-light tracking-widest text-muted italic">
          Where tradition meets refinement
        </p>
        <nav className="flex gap-6 mt-12">
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
      </section>

      {/* Signature Dishes Section */}
      <section className="max-w-5xl mx-auto px-6 py-24 sm:py-32">
        <p className="font-sans text-[0.6rem] font-light tracking-widest-3 uppercase text-muted mb-4 text-center">
          Our Signature
        </p>
        <h2 className="font-serif text-4xl sm:text-5xl font-light tracking-tight text-center mb-20">
          Five Treasures
        </h2>

        <div className="space-y-16 sm:space-y-20">
          {SIGNATURE_DISHES.map((dish) => (
            <article
              key={dish.japanese}
              className="group grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-6 sm:gap-10 items-start"
            >
              <div className="aspect-[4/3] bg-surface-hover overflow-hidden" />
              <div className="flex flex-col justify-center">
                <p className="font-serif text-2xl sm:text-3xl font-light tracking-wide text-foreground mb-1">
                  {dish.japanese}
                </p>
                <p className="font-sans text-[0.65rem] font-medium tracking-widest-2 uppercase text-accent mb-4">
                  {dish.english}
                </p>
                <p className="font-serif text-sm font-light leading-relaxed text-muted mb-4">
                  {dish.description}
                </p>
                <p className="font-sans text-sm font-light tracking-wider text-foreground">
                  {dish.price}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-16 text-center">
        <p className="font-serif text-lg font-light tracking-wide text-muted">
          蓮華
        </p>
        <p className="font-sans text-[0.6rem] font-light tracking-widest-3 uppercase text-muted mt-2">
          Renge
        </p>
      </footer>
    </div>
  );
}
