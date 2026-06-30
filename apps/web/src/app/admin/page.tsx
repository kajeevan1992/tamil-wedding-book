import { LegacyClientPage } from '@/components/migration/LegacyClientPage';

export default function Page() {
  return <LegacyClientPage route="/admin" legacyComponent="@views/dashboard/admin/Dashboard" />;
}
