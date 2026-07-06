"use client";

import { useEffect, useState } from "react";

export interface CategoryNavItem {
  slug: string;
  name: string;
  total: number;
  completed: number;
}

export function CategoryNav({ categories }: { categories: CategoryNavItem[] }) {
  const [activeSlug, setActiveSlug] = useState<string | undefined>(categories[0]?.slug);

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

  return (
    <nav
      aria-label="Lesson categories"
      className="sticky top-0 z-10 -mx-6 flex gap-2 overflow-x-auto border-b border-border bg-background/95 px-6 py-3 backdrop-blur sm:-mx-10 sm:px-10"
    >
      {categories.map((category) => (
        <a
          key={category.slug}
          href={`#category-${category.slug}`}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
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
    </nav>
  );
}
