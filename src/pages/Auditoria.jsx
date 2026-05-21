import { ArrowLeft, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import IngredientAuditTable from '../components/IngredientAuditTable.jsx';
import IngredientDetailPanel from '../components/IngredientDetailPanel.jsx';
import IngredientFormModal from '../components/IngredientFormModal.jsx';
import { useAuditConfig } from '../App.jsx';

const filters = [
  { id: 'Alerta', label: 'Solo alertas' },
  { id: 'Todos', label: 'Todos' },
  { id: 'Vigilar', label: 'Vigilar' },
  { id: 'Oportunidad', label: 'Oportunidades' },
];

export default function Auditoria() {
  const {
    getStatus,
    reviewedAlerts,
    markReviewed,
    targetMargin,
    recipes,
    ingredients,
    createIngredient,
    updateIngredient,
    deleteIngredient,
  } = useAuditConfig();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedFilter = searchParams.get('estado') ?? 'Alerta';
  const filter = filters.some((item) => item.id === requestedFilter) ? requestedFilter : 'Alerta';
  const [selected, setSelected] = useState(null);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredIngredients = useMemo(
    () =>
      ingredients.filter((ingredient) => {
        if (filter === 'Todos') return true;
        return getStatus(ingredient.variacion_pct) === filter;
      }),
    [filter, getStatus, ingredients],
  );

  function setFilter(nextFilter) {
    setSearchParams({ estado: nextFilter });
  }

  function openCreateForm() {
    setEditingIngredient(null);
    setIsFormOpen(true);
  }

  function openEditForm(ingredient) {
    setEditingIngredient(ingredient);
    setIsFormOpen(true);
  }

  function handleSave(ingredient) {
    if (editingIngredient) {
      updateIngredient(ingredient);
    } else {
      createIngredient(ingredient);
    }
    setIsFormOpen(false);
    setEditingIngredient(null);
  }

  function handleDelete(id) {
    const ingredient = ingredients.find((item) => item.id === id);
    const confirmed = window.confirm(`¿Eliminar "${ingredient?.nombre ?? 'este insumo'}"?`);
    if (confirmed) {
      deleteIngredient(id);
      if (selected?.id === id) setSelected(null);
    }
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div className="relative">
          <BackToHome />
          <div>
            <p className="text-sm font-bold text-dorado">Auditoría semanal</p>
            <h1 className="mt-1 text-3xl font-bold text-cacao">Variación de insumos</h1>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.id}
                className={`focus-ring rounded-lg px-3 py-2 text-sm font-bold transition ${
                  filter === item.id
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50'
                }`}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            className="focus-ring inline-flex w-fit items-center gap-2 rounded-lg bg-slate-800 px-4 py-3 font-bold text-white transition hover:bg-[#0f172a]"
            onClick={openCreateForm}
          >
            <Plus size={18} />
            Nuevo insumo
          </button>
        </div>
      </header>

      <IngredientAuditTable
        ingredients={filteredIngredients}
        getStatus={getStatus}
        onSelect={setSelected}
        onEdit={openEditForm}
        onDelete={handleDelete}
        reviewedAlerts={reviewedAlerts}
      />

      <IngredientDetailPanel
        ingredient={selected}
        onClose={() => setSelected(null)}
        getStatus={getStatus}
        markReviewed={markReviewed}
        reviewed={selected ? reviewedAlerts.includes(selected.id) : false}
        targetMargin={targetMargin}
        recipes={recipes}
        ingredients={ingredients}
      />

      {isFormOpen && (
        <IngredientFormModal
          ingredient={editingIngredient}
          onClose={() => {
            setIsFormOpen(false);
            setEditingIngredient(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function BackToHome() {
  return (
    <Link
      to="/"
      className="focus-ring absolute -left-14 top-1 grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-slate-800 shadow-sm ring-1 ring-stone-200 transition hover:bg-slate-800 hover:text-white"
      aria-label="Volver al inicio"
      title="Volver al inicio"
    >
      <ArrowLeft size={19} />
    </Link>
  );
}
