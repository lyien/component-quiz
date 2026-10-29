import { QUESTIONS, RESULTS } from './data.js';

/**
 * Work out the result from the chosen answer indexes (one per question).
 * - Main pick = +2, secondary pick = +1. Highest total wins.
 * - Tie-break 1: the tied component with more +2 picks wins.
 * - Tie-break 2: the tied component picked in the latest question wins
 *   (main pick before secondary pick within that answer).
 * - Final fallback: the order components are listed in RESULTS.
 */
export function scoreQuiz(answers, questions = QUESTIONS) {
  const keys = Object.keys(RESULTS);
  const points = Object.fromEntries(keys.map((k) => [k, 0]));
  const mains = Object.fromEntries(keys.map((k) => [k, 0]));

  answers.forEach((choice, i) => {
    if (choice == null) return;
    const [, main, secondary] = questions[i].a[choice];
    points[main] += 2;
    mains[main] += 1;
    points[secondary] += 1;
  });

  const top = Math.max(...keys.map((k) => points[k]));
  let tied = keys.filter((k) => points[k] === top);

  if (tied.length > 1) {
    const mostMains = Math.max(...tied.map((k) => mains[k]));
    tied = tied.filter((k) => mains[k] === mostMains);
  }

  if (tied.length > 1) {
    for (let i = answers.length - 1; i >= 0; i--) {
      if (answers[i] == null) continue;
      const [, main, secondary] = questions[i].a[answers[i]];
      if (tied.includes(main)) return { winner: main, points };
      if (tied.includes(secondary)) return { winner: secondary, points };
    }
  }

  return { winner: tied[0], points };
}
