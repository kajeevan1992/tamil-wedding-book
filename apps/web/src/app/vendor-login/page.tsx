import { LegacyClientPage } from '@/components/migration/LegacyClientPage';

export default function Page() {
  return <LegacyClientPage route="/vendor-login" legacyComponent="@views/auth/VendorLogin" />;
}
