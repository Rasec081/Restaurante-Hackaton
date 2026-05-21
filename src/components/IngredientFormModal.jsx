import { Save, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { proveedores } from '../data/proveedores.js';

const unitOptions = ['kg', 'g', 'l', 'ml', 'unidad'];

const emptyIngredient = {
  nombre: '',
  unidad: 'kg',
  precio_anterior: 1000,
  precio_actual: 1000,
  proveedor_id: 'walmart-cr',
  fecha_deteccion: new Date().toISOString().slice(0, 10),
};

function calculateVariation(previousPrice, currentPrice) {
  if (!previousPrice) return 0;
  return ((currentPrice - previousPrice) / previousPrice) * 100;
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function IngredientFormModal({ ingredient, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    ...emptyIngredient,
    ...ingredient,
  }));

  const variation = useMemo(
    () => calculateVariation(Number(form.precio_anterior), Number(form.precio_actual)),
    [form.precio_anterior, form.precio_actual],
  );
  const canSave =
    form.nombre.trim() &&
    Number(form.precio_anterior) > 0 &&
    Number(form.precio_actual) >= 0 &&
    form.proveedor_id;
  const title = ingredient ? 'Editar insumo' : 'Nuevo insumo';

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!canSave) return;

    onSave({
      ...form,
      id: ingredient?.id ?? `${slugify(form.nombre)}-${Date.now()}`,
      nombre: form.nombre.trim(),
      precio_anterior: Number(form.precio_anterior),
      precio_actual: Number(form.precio_actual),
      variacion_pct: Number(variation.toFixed(2)),
    });
  }

  return (
    <div className="fixed inset-0 z-50">
      <button className="absolute inset-0 bg-cacao/30 backdrop-blur-[1px]" onClick={onClose} aria-label="Cerrar" />
      <div className="absolute left-1/2 top-8 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 rounded-lg bg-white shadow-2xl">
        <form onSubmit={handleSubmit}>
          <div className="flex items-start justify-between gap-4 border-b border-stone-200 px-5 py-4">
            <div>
              <p className="text-sm font-bold text-dorado">Auditoría semanal</p>
              <h2 className="mt-1 text-2xl font-bold text-cacao">{title}</h2>
            </div>
            <button
              type="button"
              className="focus-ring rounded-lg p-2 text-stone-500 hover:bg-stone-100 hover:text-cacao"
              onClick={onClose}
              aria-label="Cerrar"
            >
              <X size={22} />
            </button>
          </div>

          <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
            <Field label="Producto">
              <input
                className="focus-ring w-full rounded-lg border border-stone-200 px-3 py-2"
                value={form.nombre}
                onChange={(event) => updateField('nombre', event.target.value)}
                placeholder="Ej. Café molido"
              />
            </Field>
            <Field label="Unidad">
              <select
                className="focus-ring w-full rounded-lg border border-stone-200 px-3 py-2"
                value={form.unidad}
                onChange={(event) => updateField('unidad', event.target.value)}
              >
                {[...new Set([...unitOptions, form.unidad])].filter(Boolean).map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Precio anterior">
              <input
                className="focus-ring w-full rounded-lg border border-stone-200 px-3 py-2"
                type="number"
                min="1"
                step="1"
                value={form.precio_anterior}
                onChange={(event) => updateField('precio_anterior', event.target.value)}
              />
            </Field>
            <Field label="Precio actual">
              <input
                className="focus-ring w-full rounded-lg border border-stone-200 px-3 py-2"
                type="number"
                min="0"
                step="1"
                value={form.precio_actual}
                onChange={(event) => updateField('precio_actual', event.target.value)}
              />
            </Field>
            <Field label="Proveedor">
              <select
                className="focus-ring w-full rounded-lg border border-stone-200 px-3 py-2"
                value={form.proveedor_id}
                onChange={(event) => updateField('proveedor_id', event.target.value)}
              >
                {proveedores.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.nombre}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Fecha de detección">
              <input
                className="focus-ring w-full rounded-lg border border-stone-200 px-3 py-2"
                type="date"
                value={form.fecha_deteccion}
                onChange={(event) => updateField('fecha_deteccion', event.target.value)}
              />
            </Field>
            <div className="rounded-lg bg-stone-50 p-3 sm:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wide text-stone-500">Variación calculada</p>
              <p className="mt-1 text-xl font-bold text-cacao">{variation.toFixed(1)}%</p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-stone-200 px-5 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="focus-ring rounded-lg px-4 py-2 font-bold text-stone-600 hover:bg-stone-100"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2 font-bold text-white transition hover:bg-[#0f172a] disabled:cursor-not-allowed disabled:bg-stone-300"
              disabled={!canSave}
            >
              <Save size={17} />
              Guardar insumo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wide text-stone-500">{label}</span>
      <span className="mt-1 block">{children}</span>
    </label>
  );
}
