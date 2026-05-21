import { Plus, Save, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';

const unitOptions = ['kg', 'g', 'l', 'ml', 'unidad', 'porción', 'cda', 'cdta', 'taza'];

const emptyRecipe = {
  nombre: '',
  categoria: 'Plato fuerte',
  precio_venta: 3500,
};

function getEmptyIngredient(ingredients) {
  const firstIngredient = ingredients[0];

  return {
    ingrediente_id: firstIngredient?.id ?? '',
    cantidad: 0.1,
    unidad: firstIngredient?.unidad ?? 'kg',
  };
}

export default function RecipeFormModal({ recipe, onClose, onSave, ingredients }) {
  const [form, setForm] = useState(() => ({
    ...emptyRecipe,
    ...recipe,
    ingredientes: recipe?.ingredientes?.length ? recipe.ingredientes : [getEmptyIngredient(ingredients)],
  }));

  const title = recipe ? 'Editar platillo' : 'Nuevo platillo';
  const canSave =
    form.nombre.trim() &&
    Number(form.precio_venta) > 0 &&
    form.ingredientes.length > 0 &&
    form.ingredientes.every((item) => item.ingrediente_id && Number(item.cantidad) > 0);

  const ingredientOptions = useMemo(
    () => ingredients.map((ingredient) => ({ id: ingredient.id, label: ingredient.nombre, unit: ingredient.unidad })),
    [ingredients],
  );

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateIngredient(index, field, value) {
    setForm((current) => ({
      ...current,
      ingredientes: current.ingredientes.map((item, itemIndex) => {
        if (itemIndex !== index) return item;

        if (field === 'ingrediente_id') {
          const selected = ingredients.find((ingredient) => ingredient.id === value);
          return { ...item, ingrediente_id: value, unidad: selected?.unidad ?? item.unidad };
        }

        return { ...item, [field]: value };
      }),
    }));
  }

  function addIngredient() {
    setForm((current) => ({
      ...current,
      ingredientes: [...current.ingredientes, getEmptyIngredient(ingredients)],
    }));
  }

  function removeIngredient(index) {
    setForm((current) => ({
      ...current,
      ingredientes: current.ingredientes.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!canSave) return;

    onSave({
      ...form,
      id: recipe?.id ?? `platillo-${Date.now()}`,
      nombre: form.nombre.trim(),
      categoria: form.categoria.trim() || 'Sin categoría',
      precio_venta: Number(form.precio_venta),
      ingredientes: form.ingredientes.map((item) => ({
        ingrediente_id: item.ingrediente_id,
        cantidad: Number(item.cantidad),
        unidad: item.unidad,
      })),
    });
  }

  return (
    <div className="fixed inset-0 z-50">
      <button className="absolute inset-0 bg-cacao/30 backdrop-blur-[1px]" onClick={onClose} aria-label="Cerrar" />
      <div className="absolute left-1/2 top-6 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 rounded-lg bg-white shadow-2xl">
        <form onSubmit={handleSubmit}>
          <div className="flex items-start justify-between gap-4 border-b border-stone-200 px-5 py-4">
            <div>
              <p className="text-sm font-bold text-[#20C66B]">Platillos</p>
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

          <div className="max-h-[72vh] space-y-5 overflow-y-auto px-5 py-5">
            <div className="grid gap-4 sm:grid-cols-[1fr_180px_160px]">
              <Field label="Nombre">
                <input
                  className="focus-ring w-full rounded-lg border border-stone-200 px-3 py-2"
                  value={form.nombre}
                  onChange={(event) => updateField('nombre', event.target.value)}
                  placeholder="Ej. Casado vegetariano"
                />
              </Field>
              <Field label="Categoría">
                <input
                  className="focus-ring w-full rounded-lg border border-stone-200 px-3 py-2"
                  value={form.categoria}
                  onChange={(event) => updateField('categoria', event.target.value)}
                />
              </Field>
              <Field label="Precio venta">
                <input
                  className="focus-ring w-full rounded-lg border border-stone-200 px-3 py-2"
                  type="number"
                  min="0"
                  step="50"
                  value={form.precio_venta}
                  onChange={(event) => updateField('precio_venta', event.target.value)}
                />
              </Field>
            </div>

            <section>
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-cacao">Ingredientes</h3>
                <button
                  type="button"
                  className="focus-ring inline-flex items-center gap-2 rounded-lg bg-stone-100 px-3 py-2 text-sm font-bold text-stone-700 hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={addIngredient}
                  disabled={!ingredients.length}
                >
                  <Plus size={16} />
                  Agregar
                </button>
              </div>

              <div className="mt-3 space-y-3">
                {form.ingredientes.map((item, index) => (
                  <div key={`${item.ingrediente_id}-${index}`} className="grid gap-3 rounded-lg border border-stone-200 p-3 sm:grid-cols-[1fr_130px_110px_40px]">
                    <select
                      className="focus-ring rounded-lg border border-stone-200 px-3 py-2"
                      value={item.ingrediente_id}
                      onChange={(event) => updateIngredient(index, 'ingrediente_id', event.target.value)}
                    >
                      {ingredientOptions.map((ingredient) => (
                        <option key={ingredient.id} value={ingredient.id}>
                          {ingredient.label}
                        </option>
                      ))}
                    </select>
                    <input
                      className="focus-ring rounded-lg border border-stone-200 px-3 py-2"
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.cantidad}
                      onChange={(event) => updateIngredient(index, 'cantidad', event.target.value)}
                    />
                    <select
                      className="focus-ring rounded-lg border border-stone-200 px-3 py-2"
                      value={item.unidad}
                      onChange={(event) => updateIngredient(index, 'unidad', event.target.value)}
                    >
                      {[...new Set([...unitOptions, item.unidad])].filter(Boolean).map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="focus-ring grid h-10 w-10 place-items-center rounded-lg bg-[#FF5151]/10 text-[#FF5151] transition hover:bg-[#FF5151]/10 disabled:cursor-not-allowed disabled:opacity-40"
                      onClick={() => removeIngredient(index)}
                      disabled={form.ingredientes.length === 1}
                      aria-label="Eliminar ingrediente"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
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
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-[#10213D] px-4 py-2 font-bold text-white transition hover:bg-[#07152b] disabled:cursor-not-allowed disabled:bg-stone-300"
              disabled={!canSave}
            >
              <Save size={17} />
              Guardar platillo
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
