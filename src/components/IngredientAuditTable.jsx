import { CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import { currency, percent, suppliersById } from '../data/calculations.js';
import PriceAlertBadge from './PriceAlertBadge.jsx';

export default function IngredientAuditTable({
  ingredients,
  getStatus,
  onSelect,
  onEdit,
  onDelete,
  reviewedAlerts,
}) {
  return (
    <div className="panel overflow-hidden rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-stone-200 text-sm">
          <thead className="bg-stone-50 text-left text-xs font-bold uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Unidad</th>
              <th className="px-4 py-3">Precio anterior</th>
              <th className="px-4 py-3">Precio actual</th>
              <th className="px-4 py-3">Variación</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Proveedor</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 bg-white">
            {ingredients.map((ingredient) => {
              const status = getStatus(ingredient.variacion_pct);
              const reviewed = reviewedAlerts.includes(ingredient.id);
              return (
                <tr
                  key={ingredient.id}
                  className="cursor-pointer transition hover:bg-stone-50"
                  onClick={() => onSelect(ingredient)}
                >
                  <td className="px-4 py-4 font-semibold text-cacao">
                    <span className="inline-flex items-center gap-2">
                      {ingredient.nombre}
                      {reviewed && <CheckCircle2 className="text-emerald-600" size={16} />}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-stone-600">{ingredient.unidad}</td>
                  <td className="px-4 py-4 text-stone-600">{currency.format(ingredient.precio_anterior)}</td>
                  <td className="px-4 py-4 font-semibold">{currency.format(ingredient.precio_actual)}</td>
                  <td className="px-4 py-4 font-bold">{percent.format(ingredient.variacion_pct)}%</td>
                  <td className="px-4 py-4">
                    <PriceAlertBadge status={status} />
                  </td>
                  <td className="px-4 py-4 text-stone-600">{suppliersById[ingredient.proveedor_id].nombre}</td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        className="focus-ring grid h-9 w-9 place-items-center rounded-lg bg-stone-100 text-stone-600 transition hover:bg-stone-200 hover:text-cacao"
                        onClick={(event) => {
                          event.stopPropagation();
                          onEdit(ingredient);
                        }}
                        aria-label={`Editar ${ingredient.nombre}`}
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="focus-ring grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDelete(ingredient.id);
                        }}
                        aria-label={`Eliminar ${ingredient.nombre}`}
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!ingredients.length && (
        <div className="grid min-h-48 place-items-center bg-white px-6 text-center">
          <div>
            <p className="font-bold text-cacao">Sin insumos en este filtro</p>
            <p className="mt-1 text-sm text-stone-500">Cambia el estado para revisar más productos.</p>
          </div>
        </div>
      )}
    </div>
  );
}
