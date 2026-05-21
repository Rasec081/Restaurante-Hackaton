import { ArrowRight, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuditSummaryCards from '../components/AuditSummaryCards.jsx';
import WeeklyAuditStatus from '../components/WeeklyAuditStatus.jsx';
import { useAuditConfig } from '../App.jsx';
import { auditoria } from '../data/auditoria.js';
import { ingredientes } from '../data/ingredientes.js';
import { getAuditCounts } from '../data/calculations.js';

export default function Dashboard() {
  const { getStatus } = useAuditConfig();
  const counts = getAuditCounts(getStatus);
  const averageVariation =
    ingredientes.reduce((sum, item) => sum + item.variacion_pct, 0) / ingredientes.length;

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-terracota px-5 py-7 text-white shadow-soft sm:px-8">
        <p className="text-sm font-bold text-dorado">FoodCost Audit</p>
        <div className="mt-2 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="max-w-2xl text-3xl font-bold sm:text-4xl">
              Audita tus insumos. Protege tus márgenes.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-orange-50 sm:text-base">
              Monitorea variaciones de proveedores en Costa Rica y detecta platos que necesitan
              revisión antes de que el costo se coma la utilidad.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-orange-50">
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={17} />
              Última auditoría: {auditoria.fecha_ultima_auditoria}
            </span>
            <span>Próxima programada: {auditoria.fecha_proxima_auditoria}</span>
          </div>
        </div>
      </section>

      <AuditSummaryCards counts={counts} averageVariation={averageVariation} />
      <WeeklyAuditStatus counts={counts} />

      <section className="grid gap-4 md:grid-cols-2">
        <QuickLink
          to="/auditoria"
          title="Revisar auditoría semanal"
          description="Ver precios, variaciones y platos afectados por cada insumo."
        />
        <QuickLink
          to="/recetas"
          title="Analizar recetas"
          description="Explorar costos por plato y márgenes contra el objetivo configurado."
        />
      </section>
    </div>
  );
}

function QuickLink({ to, title, description }) {
  return (
    <Link className="panel focus-ring rounded-lg p-5 transition hover:-translate-y-0.5 hover:shadow-lg" to={to}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-cacao">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-stone-100 text-terracota">
          <ArrowRight size={20} />
        </div>
      </div>
    </Link>
  );
}
