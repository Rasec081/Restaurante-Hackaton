import { ingredientes } from './ingredientes.js';
import { proveedores } from './proveedores.js';

export const currency = new Intl.NumberFormat('es-CR', {
  style: 'currency',
  currency: 'CRC',
  maximumFractionDigits: 0,
});

export const percent = new Intl.NumberFormat('es-CR', {
  maximumFractionDigits: 1,
});

export const ingredientsById = Object.fromEntries(ingredientes.map((item) => [item.id, item]));
export const suppliersById = Object.fromEntries(proveedores.map((item) => [item.id, item]));

export function calculateRecipeCost(recipe, priceKey = 'precio_actual') {
  return recipe.ingredientes.reduce((total, item) => {
    const ingredient = ingredientsById[item.ingrediente_id];
    return total + item.cantidad * ingredient[priceKey];
  }, 0);
}

export function calculateMargin(price, cost) {
  if (!price) return 0;
  return ((price - cost) / price) * 100;
}

export function getEnrichedRecipes(sourceRecipes, getStatus = () => 'Normal') {
  return sourceRecipes.map((recipe) => {
    const costo_calculado = calculateRecipeCost(recipe);
    const margen_pct = calculateMargin(recipe.precio_venta, costo_calculado);
    const hasAlert = recipe.ingredientes.some((item) => {
      const ingredient = ingredientsById[item.ingrediente_id];
      return getStatus(ingredient.variacion_pct) === 'Alerta';
    });

    return {
      ...recipe,
      costo_calculado,
      margen_pct,
      hasAlert,
    };
  });
}

export function getAffectedRecipes(sourceRecipes, ingredientId, targetMargin = 65) {
  return sourceRecipes
    .filter((recipe) => recipe.ingredientes.some((item) => item.ingrediente_id === ingredientId))
    .map((recipe) => {
      const costo_anterior = calculateRecipeCost(recipe, 'precio_anterior');
      const costo_nuevo = calculateRecipeCost(recipe, 'precio_actual');
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

export function getAuditCounts(getStatus) {
  return ingredientes.reduce(
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
