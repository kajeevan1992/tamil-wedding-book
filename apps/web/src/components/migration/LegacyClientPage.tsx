'use client';

export type LegacyClientPageProps = {
  route: string;
  legacyComponent: string;
};

export function LegacyClientPage({ route, legacyComponent }: LegacyClientPageProps) {
  return (
    <main data-migration-route={route} data-legacy-component={legacyComponent}>
      <p>Migration shell only. Legacy UI for {route} has not been migrated yet.</p>
    </main>
  );
}
