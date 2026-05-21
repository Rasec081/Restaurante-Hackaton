import { CheckCircle2 } from 'lucide-react';

export default function WeeklyAuditStatus({ counts }) {
  const alertRatio = counts.total ? Math.round((counts.alertas / counts.total) * 100) : 0;
  const vigilanceRatio = counts.total ? Math.round((counts.vigilancia / counts.total) * 100) : 0;
  const stableRatio = Math.max(0, 100 - alertRatio - vigilanceRatio);

  return (
    <section className="panel rounded-lg p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-dorado">Estado semanal</p>
          <h2 className="mt-1 text-xl font-bold text-cacao">Auditoría activa y lista para revisión</h2>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-700">
          <CheckCircle2 size={17} />
          Datos mock actualizados
        </div>
      </div>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-stone-100">
        <div className="flex h-full">
          <span className="bg-red-500" style={{ width: `${alertRatio}%` }} />
          <span className="bg-amber-500" style={{ width: `${vigilanceRatio}%` }} />
          <span className="bg-emerald-500" style={{ width: `${stableRatio}%` }} />
        </div>
      </div>
      <div className="mt-4 grid gap-2 text-sm text-stone-600 sm:grid-cols-3">
        <span>{alertRatio}% requiere acción</span>
        <span>{vigilanceRatio}% en vigilancia</span>
        <span>{stableRatio}% estable u oportunidad</span>
      </div>
    </section>
  );
}
