import { Button } from '@/components/ui/button';
import { DEFAULT_MODEL_ID, MODELS, type ProviderId } from '@/config/models';
import { WIZARD } from '@/constants/copy';
import { useSettings } from '@/hooks/useSettings';
import { formatUsd } from '@/lib/format';
import { cn } from '@/lib/utils';
import { costPerItem } from '@/utils/costEstimator';

/** Pick a model. Choice is remembered in settings. */
export function ModelStep({
  providerId,
  onBack,
  onNext,
}: {
  providerId: ProviderId;
  onBack: () => void;
  onNext: () => void;
}) {
  const [settings, updateSettings] = useSettings();
  const models = MODELS.filter((m) => m.provider === providerId);

  return (
    <div className="flex flex-col gap-5">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-[13px] text-muted-foreground">{WIZARD.model.help}</legend>
        {models.map((m) => {
          const selected = m.id === settings.modelId;
          return (
            <label
              key={m.id}
              className={cn(
                'flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 has-focus-visible:ring-3 has-focus-visible:ring-ring/50',
                selected ? 'border-[1.5px] border-accent-warm bg-[#faf7f2]' : 'border-border hover:bg-muted/50'
              )}
            >
              <input
                type="radio"
                name="model"
                value={m.id}
                checked={selected}
                onChange={() => updateSettings({ modelId: m.id })}
                className="sr-only"
              />
              <span className="flex flex-col gap-0.5">
                <span className="flex items-center gap-2 font-medium">
                  {m.label}
                  {m.id === DEFAULT_MODEL_ID && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-accent-ink">
                      {WIZARD.model.recommended}
                    </span>
                  )}
                </span>
                <span className="text-[13px] text-muted-foreground">{WIZARD.model.descriptions[m.id]}</span>
              </span>
              <span className="flex flex-none flex-col items-end">
                <span className="font-mono text-sm">
                  ~{formatUsd(costPerItem(m.id, settings.imageQuality) * 100)}
                </span>
                <span className="text-[11px] text-muted-foreground">{WIZARD.model.per100}</span>
              </span>
            </label>
          );
        })}
      </fieldset>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="xl" onClick={onBack}>
          {WIZARD.back}
        </Button>
        <Button size="xl" onClick={onNext}>
          {WIZARD.next}
        </Button>
      </div>
    </div>
  );
}
