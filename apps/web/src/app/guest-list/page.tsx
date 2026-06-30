import { LegacyClientPage } from '@/components/migration/LegacyClientPage';

export default function Page() {
  return <LegacyClientPage route="/guest-list" legacyComponent="@views/planning/Guestlist" />;
}
