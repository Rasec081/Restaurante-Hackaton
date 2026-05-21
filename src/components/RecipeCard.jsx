import { ChevronDown, ChevronUp, Pencil, Trash2, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { currency, ingredientsById, percent } from '../data/calculations.js';

export default function RecipeCard({ recipe, targetMargin, getStatus, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const belowTarget = recipe.margen_pct < targetMargin;
  const profit = recipe.precio_venta - recipe.costo_calculado;

  return (
    <article className="panel rounded-lg p-5">
      <div className="flex items-start gap-3">
        <button className="w-full text-left" onClick={() => setOpen((value) => !value)}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-dorado">{recipe.categoria}</p>
              <h2 className="mt-1 text-xl font-bold text-cacao">{recipe.nombre}</h2>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-stone-100 text-stone-600">
              {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>
        </button>
        <div className="flex gap-2">
          <button
            className="focus-ring grid h-9 w-9 place-items-center rounded-lg bg-stone-100 text-stone-600 transition hover:bg-stone-200 hover:text-cacao"
            onClick={() => onEdit(recipe)}
            aria-label={`Editar ${recipe.nombre}`}
            title="Editar"
          >
            <Pencil size={17} />
          </button>
          <button
            className="focus-ring grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
            onClick={() => onDelete(recipe.id)}
            aria-label={`Eliminar ${recipe.nombre}`}
            title="Eliminar"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      <button className="mt-4 w-full text-left" onClick={() => setOpen((value) => !value)}>
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Metric label="Venta" value={currency.format(recipe.precio_venta)} />
          <Metric label="Costo" value={currency.format(recipe.costo_calculado)} />
          <Metric label="Ganancia" value={currency.format(profit)} />
          <Metric label="Margen" value={`${percent.format(recipe.margen_pct)}%`} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {recipe.hasAlert && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
              <TriangleAlert size={14} />
              Insumo en alerta
            </span>
          )}
          {belowTarget && (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
              Bajo margen objetivo
            </span>
          )}
        </div>
      </button>

      {open && (
        <div className="mt-5 overflow-hidden rounded-lg border border-stone-200">
          <table className="min-w-full divide-y divide-stone-200 text-sm">
            <thead className="bg-stone-50 text-left text-xs font-bold uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-3 py-3">Ingrediente</th>
                <th className="px-3 py-3">Cantidad</th>
                <th className="px-3 py-3">Unitario</th>
                <th className="px-3 py-3">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {recipe.ingredientes.map((item) => {
                const ingredient = ingredientsById[item.ingrediente_id];
                const isAlert = getStatus(ingredient.variacion_pct) === 'Alerta';
                return (
                  <tr
                    key={item.ingrediente_id}
                    className={isAlert ? 'bg-red-50/80 ring-1 ring-inset ring-red-100' : undefined}
                  >
                    <td className="px-3 py-3 font-semibold text-cacao">
                      <div className="flex flex-wrap items-center gap-2">
                        <span>{ingredient.nombre}</span>
                        {isAlert && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
                            <TriangleAlert size={13} />
                            +{percent.format(ingredient.variacion_pct)}%
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={`px-3 py-3 ${isAlert ? 'font-semibold text-red-700' : 'text-stone-600'}`}>
                      {item.cantidad} {item.unidad}
                    </td>
                    <td className={`px-3 py-3 ${isAlert ? 'font-bold text-red-700' : 'text-stone-600'}`}>
                      {currency.format(ingredient.precio_actual)}
                    </td>
                    <td className={`px-3 py-3 font-semibold ${isAlert ? 'text-red-700' : ''}`}>
                      {currency.format(item.cantidad * ingredient.precio_actual)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg bg-stone-50 p-3">
      <p className="text-xs font-semibold text-stone-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-cacao sm:text-base">{value}</p>
    </div>
  );
}
