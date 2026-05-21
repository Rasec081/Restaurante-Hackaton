import { X } from 'lucide-react';
import { getAffectedRecipes, currency, percent, suppliersById } from '../data/calculations.js';
import PriceAlertBadge from './PriceAlertBadge.jsx';

export default function IngredientDetailPanel({
  ingredient,
  onClose,
  getStatus,
  markReviewed,
  reviewed,
  targetMargin,
  recipes,
  ingredients,
}) {
  if (!ingredient) return null;

  const status = getStatus(ingredient.variacion_pct);
  const affectedRecipes = getAffectedRecipes(recipes, ingredients, ingredient.id, targetMargin);

  return (
    <div className="fixed inset-0 z-40">
      <button
        className="absolute inset-0 bg-cacao/30 backdrop-blur-[1px]"
        aria-label="Cerrar detalle"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        <div className="border-b border-stone-200 px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <PriceAlertBadge status={status} />
              <h2 className="mt-3 text-2xl font-bold text-cacao">{ingredient.nombre}</h2>
              <p className="mt-1 text-sm text-stone-500">
                {suppliersById[ingredient.proveedor_id].nombre} · Detectado {ingredient.fecha_deteccion}
              </p>
            </div>
            <button
              className="focus-ring rounded-lg p-2 text-stone-500 hover:bg-stone-100 hover:text-cacao"
              onClick={onClose}
              aria-label="Cerrar"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="grid grid-cols-3 gap-3">
            <Metric label="Anterior" value={currency.format(ingredient.precio_anterior)} />
            <Metric label="Actual" value={currency.format(ingredient.precio_actual)} />
            <Metric label="Variación" value={`${percent.format(ingredient.variacion_pct)}%`} />
          </div>

          <h3 className="mt-7 text-sm font-bold uppercase tracking-wide text-stone-500">
            Platos impactados
          </h3>
          <div className="mt-3 space-y-3">
            {affectedRecipes.map((recipe) => (
              <article key={recipe.id} className="rounded-lg border border-stone-200 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-bold text-cacao">{recipe.nombre}</p>
                    <p className="text-sm text-stone-500">{recipe.categoria}</p>
                  </div>
                  <span
                    className={`w-fit rounded-full px-2.5 py-1 text-xs font-bold ${
                      recipe.margen_nuevo < 30
                        ? 'bg-red-100 text-red-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {recipe.sugerencia}
                  </span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Metric label="Costo anterior" value={currency.format(recipe.costo_anterior)} compact />
                  <Metric label="Costo nuevo" value={currency.format(recipe.costo_nuevo)} compact />
                  <Metric label="Margen anterior" value={`${percent.format(recipe.margen_anterior)}%`} compact />
                  <Metric label="Margen nuevo" value={`${percent.format(recipe.margen_nuevo)}%`} compact />
                  <Metric label="Precio venta" value={currency.format(recipe.precio_venta)} compact />
                  <Metric label={`Sugerido ${targetMargin}%`} value={currency.format(recipe.precio_sugerido)} compact />
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="border-t border-stone-200 p-5">
          <button
            className="focus-ring w-full rounded-lg bg-slate-800 px-4 py-3 font-bold text-white transition hover:bg-[#0f172a] disabled:cursor-not-allowed disabled:bg-stone-300"
            onClick={() => markReviewed(ingredient.id)}
            disabled={reviewed}
          >
            {reviewed ? 'Alerta revisada' : 'Marcar como revisado'}
          </button>
        </div>
      </aside>
    </div>
  );
}

function Metric({ label, value, compact = false }) {
  return (
    <div className="rounded-lg bg-stone-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">{label}</p>
      <p className={`${compact ? 'text-base' : 'text-lg'} mt-1 font-bold text-cacao`}>{value}</p>
    </div>
  );
}
