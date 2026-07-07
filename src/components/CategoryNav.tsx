"use client";

import { useEffect, useRef, useState } from "react";

export interface CategoryNavItem {
  slug: string;
  name: string;
  total: number;
  completed: number;
}

export function CategoryNav({ categories }: { categories: CategoryNavItem[] }) {
  const [activeSlug, setActiveSlug] = useState<string | undefined>(categories[0]?.slug);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = categories
      .map((category) => document.getElementById(`category-${category.slug}`))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveSlug(visible[0].target.id.replace("category-", ""));
        }
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [categories]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const updateEdges = () => {
      setCanScrollLeft(el.scrollLeft > 1);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [categories]);

  function scrollByDirection(direction: -1 | 1) {
    scrollerRef.current?.scrollBy({ left: direction * 220, behavior: "smooth" });
  }

  return (
    <nav
      aria-label="Lesson categories"
      className="sticky top-17 z-10 md:top-0 -mx-6 border-b border-border bg-background/95 backdrop-blur sm:-mx-10"
    >
      <div className="relative">
        <div ref={scrollerRef} className="no-scrollbar flex gap-2 overflow-x-auto px-6 py-3 sm:px-10">
          {categories.map((category) => (
            <a
              key={category.slug}
              href={`#category-${category.slug}`}
              className={`flex items-center md:items-auto w-48 md:w-auto shrink-0 rounded-full border px-3 py-1.5 pl-4 md:pl-3 text-xs font-medium transition ${
                activeSlug === category.slug
                  ? "border-gold bg-gold/10 text-foreground"
                  : "border-border bg-surface text-muted hover:border-gold/50"
              }`}
            >
              {category.name}
              <span className="ml-1.5 text-[10px] text-muted">
                {category.completed}/{category.total}
              </span>
            </a>
          ))}
        </div>

        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background/95 to-transparent transition-opacity duration-200 sm:w-14 ${
            canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background/95 to-transparent transition-opacity duration-200 sm:w-14 ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
        />

        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollByDirection(-1)}
            aria-label="Scroll categories left"
            className="absolute left-1 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-muted shadow-sm transition hover:border-gold/50 hover:text-foreground"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollByDirection(1)}
            aria-label="Scroll categories right"
            className="absolute right-1 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-muted shadow-sm transition hover:border-gold/50 hover:text-foreground"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
      </div>
    </nav>
  );
}
