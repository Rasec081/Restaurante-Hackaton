import { Activity, AlertTriangle, PackageCheck, TrendingUp } from 'lucide-react';
import { percent } from '../data/calculations.js';

const iconMap = {
  total: PackageCheck,
  alertas: AlertTriangle,
  vigilancia: Activity,
  promedio: TrendingUp,
};

const toneMap = {
  total: 'bg-stone-100 text-stone-700',
  alertas: 'bg-[#FF5151]/10 text-[#FF5151]',
  vigilancia: 'bg-[#FDBA2D]/15 text-[#FDBA2D]',
  promedio: 'bg-[#10213D]/10 text-[#10213D]',
};

export default function AuditSummaryCards({ counts, averageVariation }) {
  const cards = [
    { key: 'total', label: 'Insumos auditados', value: counts.total },
    { key: 'alertas', label: 'Alertas activas', value: counts.alertas },
    { key: 'vigilancia', label: 'En vigilancia', value: counts.vigilancia },
    { key: 'promedio', label: 'Variación promedio', value: `${percent.format(averageVariation)}%` },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = iconMap[card.key];
        return (
          <article key={card.key} className="panel rounded-lg p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-stone-500">{card.label}</p>
                <p className="mt-2 text-3xl font-bold text-cacao">{card.value}</p>
              </div>
              <div className={`grid h-11 w-11 place-items-center rounded-lg ${toneMap[card.key]}`}>
                <Icon size={21} />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
