import { ArrowRight, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuditConfig } from '../App.jsx';
import { auditoria } from '../data/auditoria.js';
import { getAuditCounts, getEnrichedRecipes } from '../data/calculations.js';

export default function Dashboard() {
  const { getStatus, recipes } = useAuditConfig();
  const counts = getAuditCounts(getStatus);
  const dishesToReview = getEnrichedRecipes(recipes, getStatus).filter((recipe) => recipe.hasAlert).length;
  const hasAnyAlert = dishesToReview > 0 || counts.alertas > 0;

  return (
    <section className="overflow-hidden rounded-lg bg-white shadow-soft ring-1 ring-stone-200">
      <div className="px-5 py-8 sm:px-8 lg:py-10">
          <h1 className="mt-2 text-4xl font-bold text-dorado sm:text-5xl">SOSCIO</h1>
          <p className={`mt-4 inline-flex rounded-full px-3 py-1.5 text-sm font-bold ${
            hasAnyAlert ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
          }`}>
            {hasAnyAlert ? 'Hay puntos que requieren revisión' : 'No hay alertas críticas por ahora'}
          </p>

          <div className="mt-8 grid gap-4 xl:grid-cols-[280px_1fr]">
            <AuditDates />
            <div className="space-y-3">
              <AlertButton
                to="/recetas"
                count={dishesToReview}
                title={`Tienes ${dishesToReview} platillos que deberías revisar`}
              />
              <AlertButton
                to="/auditoria"
                count={counts.alertas}
                title={`Tienes ${counts.alertas} alertas de insumos`}
              />
            </div>
          </div>
      </div>
    </section>
  );
}

function AuditDates() {
  return (
    <div className="rounded-lg bg-slate-800 p-5 text-white">
      <div className="flex items-center gap-2 text-sm font-bold text-orange-50">
        <CalendarDays size={18} />
        Fechas de auditoría
      </div>
      <dl className="mt-4 space-y-4 text-sm">
        <div>
          <dt className="text-orange-100">Última auditoría</dt>
          <dd className="mt-1 text-xl font-bold">{auditoria.fecha_ultima_auditoria}</dd>
        </div>
        <div>
          <dt className="text-orange-100">Próxima programada</dt>
          <dd className="mt-1 text-xl font-bold">{auditoria.fecha_proxima_auditoria}</dd>
        </div>
      </dl>
    </div>
  );
}

function AlertButton({ to, count, title }) {
  const active = count > 0;

  return (
    <Link
      to={to}
      className={`focus-ring flex items-center justify-between gap-4 rounded-lg border px-4 py-4 transition hover:-translate-y-0.5 hover:shadow-md ${
        active
          ? 'border-slate-800/30 bg-red-50 text-cacao hover:border-slate-800'
          : 'border-stone-200 bg-stone-50 text-stone-700'
      }`}
    >
      <div>
        <p className="text-4xl font-bold">{count}</p>
        <p className="mt-2 text-base font-bold">{title}</p>
      </div>
      <ArrowRight className={active ? 'text-slate-800' : 'text-stone-400'} size={22} />
    </Link>
  );
}
