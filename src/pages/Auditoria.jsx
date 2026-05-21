import { ArrowLeft } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import IngredientAuditTable from '../components/IngredientAuditTable.jsx';
import IngredientDetailPanel from '../components/IngredientDetailPanel.jsx';
import { useAuditConfig } from '../App.jsx';
import { ingredientes } from '../data/ingredientes.js';

const filters = [
  { id: 'Todos', label: 'Todos' },
  { id: 'Alerta', label: 'Solo alertas' },
  { id: 'Vigilar', label: 'Vigilar' },
  { id: 'Oportunidad', label: 'Oportunidades' },
];

export default function Auditoria() {
  const { getStatus, reviewedAlerts, markReviewed, targetMargin, recipes } = useAuditConfig();
  const [filter, setFilter] = useState('Todos');
  const [selected, setSelected] = useState(null);

  const filteredIngredients = useMemo(
    () =>
      ingredientes.filter((ingredient) => {
        if (filter === 'Todos') return true;
        return getStatus(ingredient.variacion_pct) === filter;
      }),
    [filter, getStatus],
  );

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="relative">
          <BackToHome />
          <div>
            <p className="text-sm font-bold text-dorado">Auditoría semanal</p>
            <h1 className="mt-1 text-3xl font-bold text-cacao">Variación de insumos</h1>
          </div>
        </div>
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
      </header>

      <IngredientAuditTable
        ingredients={filteredIngredients}
        getStatus={getStatus}
        onSelect={setSelected}
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
      />
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
