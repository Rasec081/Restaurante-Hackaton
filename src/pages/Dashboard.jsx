import { CalendarDays } from 'lucide-react';
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
    <div className="space-y-5">
      <section className="mx-auto max-w-5xl px-5 py-8 text-center sm:px-8 lg:py-9">
        <img
          className="mx-auto h-auto w-[28rem] max-w-full sm:w-[34rem] lg:w-[42rem]"
          src={logoImage}
          alt="Soscio"
        />

        <div className="mx-auto mt-8 grid max-w-4xl gap-4 md:grid-cols-2">
          <AlertButton
            to="/recetas?filtro=alerta"
            count={dishesToReview}
            title="Platillos que deberías revisar:"
          />
          <AlertButton
            to="/auditoria?estado=Alerta"
            count={counts.alertas}
            title="Alertas de insumos:"
          />
        </div>
      </section>

      <div className="flex justify-center px-5">
        <AuditDates />
      </div>
    </div>
  );
}

function AuditDates() {
  return (
    <div className="inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs text-slate-500 shadow-sm">
      <span className="inline-flex items-center gap-1.5 font-bold text-slate-600">
        <CalendarDays size={13} />
        Auditoría
      </span>
      <span>Última: <strong className="text-slate-700">{auditoria.fecha_ultima_auditoria}</strong></span>
      <span>Próxima: <strong className="text-slate-700">{auditoria.fecha_proxima_auditoria}</strong></span>
    </div>
  );
}

function AlertButton({ to, count, title }) {
  const active = count > 0;

  return (
    <Link
      to={to}
      className={`focus-ring flex aspect-[1.55/1] min-h-36 flex-col items-center justify-center gap-4 rounded-2xl border px-6 py-6 text-center transition hover:-translate-y-0.5 hover:shadow-md ${
        active
          ? 'border-[#FF5151]/15 bg-[#FF5151]/5 text-cacao hover:border-[#10213D]/40'
          : 'border-slate-200 bg-white text-slate-700'
      }`}
    >
      <div>
        <p className="max-w-xs text-sm font-bold leading-5 sm:text-base">{title}</p>
        <p className="mt-3 text-5xl font-bold leading-none tabular-nums">{count}</p>
      </div>
    </Link>
  );
}
