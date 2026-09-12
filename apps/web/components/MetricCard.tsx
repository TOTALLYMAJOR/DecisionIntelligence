import type { ReactNode } from 'react';

export function MetricCard({ label, value, detail, icon }: { label: string; value: string; detail: string; icon?: ReactNode }) {
  return (
    <article className="metricCard">
      <div className="metricTop"><span>{label}</span>{icon}</div>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}
