import { LegacyClientPage } from '@/components/migration/LegacyClientPage';

export default function Page() {
  return <LegacyClientPage route="/guest-invitation/:coupleData" legacyComponent="@views/GuestInvitations" />;
}
