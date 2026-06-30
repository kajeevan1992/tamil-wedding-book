import { LegacyClientPage } from '@/components/migration/LegacyClientPage';

export default function Page() {
  return <LegacyClientPage route="/request-reset-password" legacyComponent="@views/auth/RequestResetPassword" />;
}
