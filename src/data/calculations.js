import { proveedores } from './proveedores.js';

export const currency = new Intl.NumberFormat('es-CR', {
  style: 'currency',
  currency: 'CRC',
  maximumFractionDigits: 0,
});

export const percent = new Intl.NumberFormat('es-CR', {
  maximumFractionDigits: 1,
});

export const suppliersById = Object.fromEntries(proveedores.map((item) => [item.id, item]));

export function createIngredientsById(sourceIngredients) {
  return Object.fromEntries(sourceIngredients.map((item) => [item.id, item]));
}

export function calculateRecipeCost(recipe, sourceIngredients, priceKey = 'precio_actual') {
  const ingredientsById = createIngredientsById(sourceIngredients);

  return recipe.ingredientes.reduce((total, item) => {
    const ingredient = ingredientsById[item.ingrediente_id];
    if (!ingredient) return total;
    return total + item.cantidad * ingredient[priceKey];
  }, 0);
}

export function calculateMargin(price, cost) {
  if (!price) return 0;
  return ((price - cost) / price) * 100;
}

export function getEnrichedRecipes(sourceRecipes, getStatus = () => 'Normal', sourceIngredients = []) {
  const ingredientsById = createIngredientsById(sourceIngredients);

  return sourceRecipes.map((recipe) => {
    const costo_calculado = calculateRecipeCost(recipe, sourceIngredients);
    const margen_pct = calculateMargin(recipe.precio_venta, costo_calculado);
    const hasAlert = recipe.ingredientes.some((item) => {
      const ingredient = ingredientsById[item.ingrediente_id];
      return ingredient && getStatus(ingredient.variacion_pct) === 'Alerta';
    });

    return {
      ...recipe,
      costo_calculado,
      margen_pct,
      hasAlert,
    };
  });
}

export function getAffectedRecipes(sourceRecipes, sourceIngredients, ingredientId, targetMargin = 65) {
  return sourceRecipes
    .filter((recipe) => recipe.ingredientes.some((item) => item.ingrediente_id === ingredientId))
    .map((recipe) => {
      const costo_anterior = calculateRecipeCost(recipe, sourceIngredients, 'precio_anterior');
      const costo_nuevo = calculateRecipeCost(recipe, sourceIngredients, 'precio_actual');
      const margen_anterior = calculateMargin(recipe.precio_venta, costo_anterior);
      const margen_nuevo = calculateMargin(recipe.precio_venta, costo_nuevo);
      const precio_sugerido = costo_nuevo / (1 - targetMargin / 100);

      return {
        ...recipe,
        costo_anterior,
        costo_nuevo,
        margen_anterior,
        margen_nuevo,
        precio_sugerido,
        sugerencia:
          margen_nuevo < 30 ? 'Revisar precio de venta' : 'Margen todavía saludable',
      };
    });
}

export function getAuditCounts(sourceIngredients, getStatus) {
  return sourceIngredients.reduce(
    (counts, ingredient) => {
      const status = getStatus(ingredient.variacion_pct);
      counts.total += 1;
      if (status === 'Alerta') counts.alertas += 1;
      if (status === 'Vigilar') counts.vigilancia += 1;
      if (status === 'Normal') counts.normales += 1;
      if (status === 'Oportunidad') counts.oportunidades += 1;
      return counts;
    },
    { total: 0, alertas: 0, vigilancia: 0, normales: 0, oportunidades: 0 },
  );
}
