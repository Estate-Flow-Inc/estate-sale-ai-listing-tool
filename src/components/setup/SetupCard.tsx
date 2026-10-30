/**
 * Setup card: key, model, photos, cost estimate, generate.
 * Placeholder shell. Wired up in the setup step.
 */
export function SetupCard() {
  return (
    <div className="flex min-h-[420px] flex-col gap-4 rounded-2xl border border-border bg-card p-7">
      <span className="text-sm font-medium">1. Your OpenAI API key</span>
      <span className="text-sm font-medium">2. Model</span>
      <span className="text-sm font-medium">3. Item photos</span>
    </div>
  );
}
