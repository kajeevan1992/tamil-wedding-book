import { LegacyClientPage } from '@/components/migration/LegacyClientPage';

export default function Page() {
  return <LegacyClientPage route="/login" legacyComponent="@views/auth/Login" />;
}
