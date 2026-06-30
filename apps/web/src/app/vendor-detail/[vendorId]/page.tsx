import { LegacyClientPage } from '@/components/migration/LegacyClientPage';

export default function Page() {
  return <LegacyClientPage route="/vendor-detail/:vendorId" legacyComponent="@views/VendorDetail" />;
}
