import { LegacyClientPage } from '@/components/migration/LegacyClientPage';

export default function Page() {
  return <LegacyClientPage route="/budget-planner" legacyComponent="@views/planning/BudgetPlanner" />;
}
