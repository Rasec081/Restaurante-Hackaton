import { ArrowLeft, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard.jsx';
import RecipeFormModal from '../components/RecipeFormModal.jsx';
import { useAuditConfig } from '../App.jsx';
import { getEnrichedRecipes } from '../data/calculations.js';

const recipeFilters = [
  { id: 'alerta', label: 'Con alerta' },
  { id: 'todos', label: 'Todos' },
  { id: 'bajo-margen', label: 'Bajo margen' },
  { id: 'saludables', label: 'Saludables' },
];

export default function Recetas() {
  const { getStatus, targetMargin, recipes, ingredients, createRecipe, updateRecipe, deleteRecipe } = useAuditConfig();
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedFilter = searchParams.get('filtro') ?? 'alerta';
  const filter = recipeFilters.some((item) => item.id === requestedFilter) ? requestedFilter : 'alerta';
  const enrichedRecipes = getEnrichedRecipes(recipes, getStatus, ingredients);
  const filteredRecipes = enrichedRecipes.filter((recipe) => {
    if (filter === 'todos') return true;
    if (filter === 'alerta') return recipe.hasAlert;
    if (filter === 'bajo-margen') return recipe.margen_pct < targetMargin;
    return !recipe.hasAlert && recipe.margen_pct >= targetMargin;
  });

  function setFilter(nextFilter) {
    setSearchParams({ filtro: nextFilter });
  }

  function openCreateForm() {
    setEditingRecipe(null);
    setIsFormOpen(true);
  }

  function openEditForm(recipe) {
    setEditingRecipe(recipe);
    setIsFormOpen(true);
  }

  function handleSave(recipe) {
    if (editingRecipe) {
      updateRecipe(recipe);
    } else {
      createRecipe(recipe);
    }
    setIsFormOpen(false);
    setEditingRecipe(null);
  }

  function handleDelete(id) {
    const recipe = recipes.find((item) => item.id === id);
    const confirmed = window.confirm(`¿Eliminar "${recipe?.nombre ?? 'este platillo'}"?`);
    if (confirmed) deleteRecipe(id);
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="relative">
          <BackToHome />
          <div>
            <p className="text-sm font-bold text-[#20C66B]">Recetas costeadas</p>
            <h1 className="mt-1 text-3xl font-bold text-cacao">Márgenes por platillo</h1>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2">
            {recipeFilters.map((item) => (
              <button
                key={item.id}
                className={`focus-ring rounded-lg px-3 py-2 text-sm font-bold transition ${
                  filter === item.id
                    ? 'bg-[#10213D] text-white'
                    : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50'
                }`}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            className="focus-ring inline-flex w-fit items-center gap-2 rounded-lg bg-[#10213D] px-4 py-3 font-bold text-white transition hover:bg-[#07152b]"
            onClick={openCreateForm}
          >
            <Plus size={18} />
            Nuevo platillo
          </button>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-2">
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            targetMargin={targetMargin}
            getStatus={getStatus}
            ingredients={ingredients}
            onEdit={openEditForm}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {!filteredRecipes.length && (
        <div className="panel grid min-h-52 place-items-center rounded-lg px-6 text-center">
          <div>
            <p className="font-bold text-cacao">No hay platillos en este filtro</p>
            <p className="mt-1 text-sm text-stone-500">Cambia el filtro o agrega un nuevo platillo.</p>
          </div>
        </div>
      )}

      {isFormOpen && (
        <RecipeFormModal
          recipe={editingRecipe}
          onClose={() => {
            setIsFormOpen(false);
            setEditingRecipe(null);
          }}
          onSave={handleSave}
          ingredients={ingredients}
        />
      )}
    </div>
  );
}

function BackToHome() {
  return (
    <Link
      to="/"
      className="focus-ring absolute -left-14 top-1 grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-[#10213D] shadow-sm ring-1 ring-stone-200 transition hover:bg-[#10213D] hover:text-white"
      aria-label="Volver al inicio"
      title="Volver al inicio"
    >
      <ArrowLeft size={19} />
    </Link>
  );
}
