import { LegacyClientPage } from '@/components/migration/LegacyClientPage';

export default function Page() {
  return <LegacyClientPage route="/register" legacyComponent="@views/auth/Register" />;
}
