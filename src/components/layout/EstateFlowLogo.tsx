import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import './EstateFlowLogo.css';

import { ExternalLink } from '@/components/common/ExternalLink';
import { estateFlowLink } from '@/config/constants';
import { ESTATE_FLOW_GLOBAL_NAME } from '@/constants/copy';

export function EstateFlowLogo({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return (
    <ExternalLink href={estateFlowLink('logo')} className="logo-link" aria-label={ESTATE_FLOW_GLOBAL_NAME}>
      <span className={`estate-logo estate-logo-${size}`} aria-hidden="true">
        <span className="estate">ESTATE</span>
        <span className="flow">FLOW</span>
      </span>
    </ExternalLink>
  );
}
