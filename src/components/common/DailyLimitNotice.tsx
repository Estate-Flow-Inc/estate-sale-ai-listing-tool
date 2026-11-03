import { ExternalLink } from '@/components/common/ExternalLink';
import { ESTATE_FLOW_CONTACT_URL } from '@/config/constants';
import { DAILY_LIMIT } from '@/constants/copy';

/** Shown when Google's free daily limit stops a run: what happened and what to do. */
export function DailyLimitNotice() {
  return (
    <div role="alert" className="flex flex-col gap-1 rounded-xl border border-[#e2dacb] bg-[#f5f0e8] p-4 text-sm">
      <span className="font-semibold">{DAILY_LIMIT.title}</span>
      <p className="text-charcoal-soft">
        {DAILY_LIMIT.body}{' '}
        <ExternalLink href={ESTATE_FLOW_CONTACT_URL} className="font-medium text-accent-ink underline underline-offset-2">
          {DAILY_LIMIT.contact}
        </ExternalLink>
        .
      </p>
    </div>
  );
}
