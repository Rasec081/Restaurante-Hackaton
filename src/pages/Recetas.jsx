import RecipeCard from '../components/RecipeCard.jsx';
import { useAuditConfig } from '../App.jsx';
import { getEnrichedRecipes } from '../data/calculations.js';

export default function Recetas() {
  const { getStatus, targetMargin } = useAuditConfig();
  const recipes = getEnrichedRecipes(getStatus);

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm font-bold text-dorado">Recetas costeadas</p>
        <h1 className="mt-1 text-3xl font-bold text-cacao">Márgenes por plato</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
          Cada tarjeta calcula el costo actual con precios mock de proveedores y señala recetas con
          insumos en alerta.
        </p>
      </header>

      <div className="grid gap-4 xl:grid-cols-2">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} targetMargin={targetMargin} />
        ))}
      </div>
    </div>
  );
}
