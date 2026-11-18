"use client";

import { useEffect, useState } from "react";
import { QuestionDisplay, SearchDisplay } from "@/components/displays";
import {
  BLANK_MS,
  NUM_TRIALS,
  STAIRCASE_START,
  STIMULUS_MS,
  generateTrial,
  updateStaircase,
  type Side,
  type Staircase,
  type Trial,
} from "@/lib/experiment";
import { saveTrialResult } from "@/lib/save";

export default function Home() {
  const [prolificId, setProlificId] = useState("");
  const [trial, setTrial] = useState<Trial | null>(null);
  const [staircase, setStaircase] = useState<Staircase>({
    color: STAIRCASE_START,
    orientation: STAIRCASE_START,
  });
  const [done, setDone] = useState(false);
  // Steps alternate blank / stimulus: blank, miniblock 1, blank, ...,
  // redundant, blank, question.
  const [step, setStep] = useState(0);

  const stimuli = trial ? [...trial.miniblocks, trial.redundant] : [];
  const questionStep = stimuli.length * 2 + 1;

  useEffect(() => {
    if (!trial || step >= questionStep) return;
    const timer = setTimeout(
      () => setStep(step + 1),
      step % 2 === 0 ? BLANK_MS : STIMULUS_MS,
    );
    return () => clearTimeout(timer);
  }, [trial, step, questionStep]);

  useEffect(() => {
    if (!trial || step !== questionStep) return;
    const shownAt = performance.now();

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (e.repeat || (key !== "q" && key !== "p")) return;
      const response: Side = key === "q" ? "left" : "right";
      const correct = response === trial.question.which_correct;
      const rt_ms = Math.round(performance.now() - shownAt);
      void saveTrialResult({ prolific_id: prolificId, trial, response, correct, rt_ms });

      const next = updateStaircase(staircase, trial.question.trial_type, correct);
      setStaircase(next);
      setStep(0);
      if (trial.trial_number >= NUM_TRIALS) {
        setTrial(null);
        setDone(true);
      } else {
        setTrial(generateTrial(trial.trial_number + 1, next));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [trial, step, questionStep, staircase, prolificId]);

  function start() {
    const params = new URLSearchParams(window.location.search);
    setProlificId(params.get("PROLIFIC_PID") ?? "unknown");
    setTrial(generateTrial(1, staircase));
  }

  let screen = null; // blank
  if (done) {
    screen = <p>Done. Thank you!</p>;
  } else if (!trial) {
    screen = (
      <button className="rounded border px-6 py-3" onClick={start}>
        Start
      </button>
    );
  } else if (step === questionStep) {
    screen = <QuestionDisplay question={trial.question} />;
  } else if (step % 2 === 1) {
    screen = <SearchDisplay screen={stimuli[(step - 1) / 2]} />;
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-black text-white">
      {trial && (
        <div className="absolute top-4 right-4 text-sm text-neutral-400">
          Trial {trial.trial_number} / {NUM_TRIALS}
        </div>
      )}
      {screen}
    </main>
  );
}
