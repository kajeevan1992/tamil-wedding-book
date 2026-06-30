import { LegacyClientPage } from '@/components/migration/LegacyClientPage';

export default function Page() {
  return <LegacyClientPage route="/reset-password/:hash" legacyComponent="@views/auth/ResetPassword" />;
}
