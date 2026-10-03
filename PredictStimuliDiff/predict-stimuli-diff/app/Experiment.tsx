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

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 p-8">
      <p className="max-w-2xl text-center text-2xl leading-relaxed">
        {page.text}
      </p>

      {page.images && page.images.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4">
          {page.images.map((img, i) => {
            const isSelected = selected === i;
            return (
              <img
                key={i}
                src={img.src}
                alt={img.alt ?? ""}
                onClick={
                  img.selectable
                    ? () => setAnswers((a) => ({ ...a, [page.id]: i }))
                    : undefined
                }
                className={[
                  "h-40 w-40 rounded-lg border-2 object-cover",
                  img.selectable ? "cursor-pointer" : "",
                  isSelected
                    ? "border-blue-500 ring-2 ring-blue-500"
                    : "border-transparent",
                ].join(" ")}
              />
            );
          })}
        </div>
      )}

      {/*
        Fixed-height control slot. The waiting bar and the Next button both
        live here, one visible at a time, so swapping between them never
        shifts the text or images above.
      */}
      <div className="flex h-16 items-center justify-center">
        {canContinue ? (
          <button
            onClick={() => !isLast && setIndex((i) => i + 1)}
            disabled={isLast}
            className="rounded-lg bg-blue-600 px-6 py-3 text-lg text-white disabled:opacity-50"
          >
            {isLast ? "Done" : "Next"}
          </button>
        ) : (
          <div className="flex w-64 flex-col items-center gap-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-black/10">
              <div
                className="h-full bg-blue-600 transition-[width] duration-100"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            {/* Always rendered to reserve its height; toggled via opacity. */}
            <p
              className={`text-sm text-black/60 ${
                waitDone && needsAnswer ? "" : "invisible"
              }`}
            >
              Select an image to continue.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
