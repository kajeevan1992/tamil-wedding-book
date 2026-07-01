import { LegacyClientPage } from '@/components/migration/LegacyClientPage';

export default function NotFound() {
  return <LegacyClientPage route="*" legacyComponent="@views/NotFound" />;
}
