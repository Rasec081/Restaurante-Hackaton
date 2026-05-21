import { Plus } from 'lucide-react';
import { useState } from 'react';
import RecipeCard from '../components/RecipeCard.jsx';
import RecipeFormModal from '../components/RecipeFormModal.jsx';
import { useAuditConfig } from '../App.jsx';
import { getEnrichedRecipes } from '../data/calculations.js';

export default function Recetas() {
  const { getStatus, targetMargin, recipes, createRecipe, updateRecipe, deleteRecipe } = useAuditConfig();
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const enrichedRecipes = getEnrichedRecipes(recipes, getStatus);

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
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-dorado">Recetas costeadas</p>
          <h1 className="mt-1 text-3xl font-bold text-cacao">Márgenes por platillo</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
            Crea y administra platillos del menú. Cada tarjeta calcula el costo actual con precios
            mock y señala ingredientes en alerta.
          </p>
        </div>
        <button
          className="focus-ring inline-flex w-fit items-center gap-2 rounded-lg bg-slate-800 px-4 py-3 font-bold text-white transition hover:bg-[#0f172a]"
          onClick={openCreateForm}
        >
          <Plus size={18} />
          Nuevo platillo
        </button>
      </header>

      <div className="grid gap-4 xl:grid-cols-2">
        {enrichedRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            targetMargin={targetMargin}
            getStatus={getStatus}
            onEdit={openEditForm}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {!enrichedRecipes.length && (
        <div className="panel grid min-h-52 place-items-center rounded-lg px-6 text-center">
          <div>
            <p className="font-bold text-cacao">No hay platillos registrados</p>
            <p className="mt-1 text-sm text-stone-500">Agrega el primer platillo para calcular su margen.</p>
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
        />
      )}
    </div>
  );
}
