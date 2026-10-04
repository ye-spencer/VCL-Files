"use client";

import { useEffect, useState } from "react";
import { PAGES } from "./pages";

export default function Experiment() {
  // Current page index. Managed in state only — no URL, so no skipping.
  const [index, setIndex] = useState(0);

  // Selected image index, per page id. { [pageId]: imageIndex }
  const [answers, setAnswers] = useState<Record<string, number>>({});

  // Fraction of the wait elapsed (0 -> 1). Resets on every page.
  const [progress, setProgress] = useState(0);

  const page = PAGES[index];
  const selected = answers[page.id]; // selected image index, or undefined

  // Run the waiting bar whenever the page changes.
  useEffect(() => {
    setProgress(0);
    const total = page.waitSeconds * 1000;
    if (total <= 0) {
      setProgress(1);
      return;
    }
    const start = Date.now();
    const timer = setInterval(() => {
      const fraction = Math.min((Date.now() - start) / total, 1);
      setProgress(fraction);
      if (fraction >= 1) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, [index, page.waitSeconds]);

  const waitDone = progress >= 1;
  const needsAnswer = page.requireSelection && selected === undefined;
  const canContinue = waitDone && !needsAnswer;
  const isLast = index === PAGES.length - 1;

  const images = page.images ?? [];
  const containerClass =
    page.layout === "grid"
      ? "grid w-full max-w-4xl grid-cols-2 place-items-center gap-3 md:grid-cols-3"
      : "flex flex-wrap items-start justify-center gap-6";
  // Capped heights so a grid of images fits a typical screen without scrolling.
  const imgSize = page.layout === "grid" ? "max-h-52 w-auto" : "max-h-72 w-auto";

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 p-8">
      <p className="max-w-2xl text-center text-2xl leading-relaxed">
        {page.text}
      </p>

      {images.length > 0 && (
        <div className={containerClass}>
          {images.map((img, i) => {
            const isSelected = selected === i;
            const select = img.selectable
              ? () => setAnswers((a) => ({ ...a, [page.id]: i }))
              : undefined;
            return (
              <figure key={i} className="flex flex-col items-center gap-2">
                <img
                  src={img.src}
                  alt={img.alt ?? ""}
                  onClick={select}
                  className={[
                    img.sizeClass ?? imgSize,
                    "rounded-lg border-2 bg-white object-contain",
                    img.selectable ? "cursor-pointer" : "",
                    isSelected
                      ? "border-blue-500 ring-2 ring-blue-500"
                      : "border-transparent",
                  ].join(" ")}
                />
                {img.caption && (
                  <figcaption className="text-base text-black/70">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            );
          })}
        </div>
      )}

      {/*
        Fixed-height control slot. The waiting bar and the Next button both
        live here, one visible at a time, so swapping between them never
        shifts the content above.
      */}
      <div className="flex h-16 items-center justify-center">
        {canContinue ? (
          page.link ? (
            <a
              href={page.link.url}
              className="rounded-lg bg-blue-600 px-6 py-3 text-lg text-white"
            >
              {page.link.label}
            </a>
          ) : (
            <button
              onClick={() => !isLast && setIndex((i) => i + 1)}
              disabled={isLast}
              className="rounded-lg bg-blue-600 px-6 py-3 text-lg text-white disabled:opacity-50"
            >
              {isLast ? "Done" : "Next"}
            </button>
          )
        ) : (
          <div className="flex w-64 flex-col items-center gap-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-black/10">
              <div
                className="h-full bg-blue-600 transition-[width] duration-100"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            {/* Always rendered to reserve its height; toggled via visibility. */}
            <p
              className={`text-sm text-black/60 ${
                waitDone && needsAnswer ? "" : "invisible"
              }`}
            >
              Select a graph to continue.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
