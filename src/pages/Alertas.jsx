import { ArrowLeft, Search, TrendingDown, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuditConfig } from '../App.jsx';
import { currency, getEnrichedRecipes, percent, suppliersById } from '../data/calculations.js';

export default function Alertas() {
  const { getStatus, recipes, ingredients, targetMargin } = useAuditConfig();
  const recipeAlerts = getEnrichedRecipes(recipes, getStatus, ingredients)
    .filter((recipe) => recipe.hasAlert || recipe.margen_pct < targetMargin)
    .map((recipe) => ({
      id: `recipe-${recipe.id}`,
      level: recipe.margen_pct < 30 ? 'Crítica' : recipe.margen_pct < targetMargin ? 'Moderada' : 'Informativa',
      title:
        recipe.margen_pct < targetMargin
          ? `${recipe.nombre} tiene margen en riesgo`
          : `${recipe.nombre} usa insumos con aumento`,
      detail: `Margen actual: ${percent.format(recipe.margen_pct)}%. Costo estimado: ${currency.format(recipe.costo_calculado)}.`,
      action: recipe.margen_pct < targetMargin ? 'Revisar precio de venta' : 'Monitorear una semana más',
      icon: TrendingDown,
    }));

  const ingredientAlerts = ingredients
    .filter((ingredient) => ['Alerta', 'Vigilar'].includes(getStatus(ingredient.variacion_pct)))
    .map((ingredient) => ({
      id: `ingredient-${ingredient.id}`,
      level: getStatus(ingredient.variacion_pct) === 'Alerta' ? 'Crítica' : 'Moderada',
      title: `${ingredient.nombre} subió más de lo normal`,
      detail: `${suppliersById[ingredient.proveedor_id]?.nombre ?? 'Proveedor'} reporta ${currency.format(ingredient.precio_actual)} (${percent.format(ingredient.variacion_pct)}%).`,
      action: getStatus(ingredient.variacion_pct) === 'Alerta' ? 'Buscar proveedor alternativo' : 'Monitorear una semana más',
      icon: TrendingUp,
    }));

  const alerts = [...recipeAlerts, ...ingredientAlerts].sort((a, b) => levelWeight(a.level) - levelWeight(b.level));

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="relative">
          <BackToHome />
          <div>
            <p className="text-sm font-bold text-[#20C66B]">Centro de alertas</p>
            <h1 className="mt-1 text-3xl font-bold text-cacao">Recomendaciones accionables</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Cada alerta explica qué pasó, por qué importa y cuál es el próximo paso recomendado.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        {alerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </section>

      {!alerts.length && (
        <div className="surface grid min-h-52 place-items-center px-6 text-center">
          <div>
            <Search className="mx-auto text-[#20C66B]" size={34} />
            <p className="mt-3 font-bold text-cacao">No hay alertas activas</p>
            <p className="mt-1 text-sm text-slate-500">Tus costos se ven estables esta semana.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function AlertCard({ alert }) {
  const Icon = alert.icon;
  const styles = {
    Crítica: 'border-[#FF5151]/15 bg-[#FF5151]/5 text-[#FF5151]',
    Moderada: 'border-[#FDBA2D]/20 bg-[#FDBA2D]/10 text-[#FDBA2D]',
    Informativa: 'border-[#20C66B]/20 bg-[#20C66B]/10 text-[#20C66B]',
  };

  return (
    <article className="surface p-5">
      <div className="flex items-start justify-between gap-3">
        <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${styles[alert.level]}`}>
          {alert.level}
        </span>
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${styles[alert.level]}`}>
          <Icon size={19} />
        </div>
      </div>
      <h2 className="mt-4 text-lg font-bold text-cacao">{alert.title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{alert.detail}</p>
      <div className="mt-4 rounded-xl bg-slate-50 p-3">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Recomendación</p>
        <p className="mt-1 text-sm font-bold text-[#10213D]">{alert.action}</p>
      </div>
    </article>
  );
}

function BackToHome() {
  return (
    <Link
      to="/"
      className="focus-ring absolute -left-14 top-1 hidden h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-[#10213D] shadow-sm ring-1 ring-stone-200 transition hover:bg-[#10213D] hover:text-white sm:grid"
      aria-label="Volver al inicio"
      title="Volver al inicio"
    >
      <ArrowLeft size={19} />
    </Link>
  );
}

function levelWeight(level) {
  return { Crítica: 0, Moderada: 1, Informativa: 2 }[level] ?? 3;
}
