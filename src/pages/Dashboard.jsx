import { ArrowRight, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuditConfig } from '../App.jsx';
import logoImage from '../assets/prueba3.png';
import { auditoria } from '../data/auditoria.js';
import { getAuditCounts, getEnrichedRecipes } from '../data/calculations.js';

export default function Dashboard() {
  const { getStatus, recipes, ingredients } = useAuditConfig();
  const counts = getAuditCounts(ingredients, getStatus);
  const dishesToReview = getEnrichedRecipes(recipes, getStatus, ingredients).filter((recipe) => recipe.hasAlert).length;

  return (
    <div className="space-y-4">
      <section className="mx-auto max-w-5xl px-5 py-8 text-center sm:px-8 lg:py-9">
        <img
          className="mx-auto h-auto w-[28rem] max-w-full sm:w-[34rem] lg:w-[42rem]"
          src={logoImage}
          alt="Soscio"
        />

        <div className="mx-auto mt-7 max-w-2xl space-y-2.5">
          <AlertButton
            to="/recetas?filtro=alerta"
            count={dishesToReview}
            title={`Tienes ${dishesToReview} platillos que deberías revisar`}
          />
          <AlertButton
            to="/auditoria?estado=Alerta"
            count={counts.alertas}
            title={`Tienes ${counts.alertas} alertas de insumos`}
          />
        </div>
      </section>

      <div className="flex justify-center">
        <AuditDates />
      </div>
    </div>
  );
}

function AuditDates() {
  return (
    <div className="w-full max-w-2xl rounded-lg bg-slate-800 px-4 py-3 text-white shadow-sm">
      <div className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-200">
        <CalendarDays size={13} />
        Fechas de auditoría
      </div>
      <dl className="mt-2 grid gap-2 text-center sm:grid-cols-2">
        <div className="rounded-md bg-white/5 px-3 py-2">
          <dt className="text-[11px] font-medium text-slate-300">Última auditoría</dt>
          <dd className="mt-0.5 text-sm font-bold">{auditoria.fecha_ultima_auditoria}</dd>
        </div>
        <div className="rounded-md bg-white/5 px-3 py-2">
          <dt className="text-[11px] font-medium text-slate-300">Próxima programada</dt>
          <dd className="mt-0.5 text-sm font-bold">{auditoria.fecha_proxima_auditoria}</dd>
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
      className={`focus-ring flex items-center justify-between gap-4 rounded-lg border px-4 py-3 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
        active
          ? 'border-red-100 bg-red-50/70 text-cacao hover:border-slate-800/40'
          : 'border-stone-200 bg-stone-50 text-stone-700'
      }`}
    >
      <div className="flex items-center gap-4">
        <p className="w-9 text-3xl font-bold tabular-nums">{count}</p>
        <p className="text-sm font-bold sm:text-base">{title}</p>
      </div>
      <ArrowRight className={active ? 'text-slate-800' : 'text-stone-400'} size={18} />
    </Link>
  );
}
