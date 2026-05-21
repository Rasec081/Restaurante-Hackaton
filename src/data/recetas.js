import { ingredientes } from './ingredientes.js';

const ingredientsById = Object.fromEntries(ingredientes.map((item) => [item.id, item]));

function calculateCost(recipe) {
  return recipe.ingredientes.reduce((total, item) => {
    const ingredient = ingredientsById[item.ingrediente_id];
    return total + item.cantidad * ingredient.precio_actual;
  }, 0);
}

function calculateMargin(precioVenta, costo) {
  return ((precioVenta - costo) / precioVenta) * 100;
}

const recetasBase = [
  {
    id: 'casado-pollo',
    nombre: 'Casado con pollo',
    categoria: 'Plato fuerte',
    precio_venta: 4200,
    ingredientes: [
      { ingrediente_id: 'arroz', cantidad: 0.16, unidad: 'kg' },
      { ingrediente_id: 'frijoles', cantidad: 0.12, unidad: 'kg' },
      { ingrediente_id: 'pollo-entero', cantidad: 0.22, unidad: 'kg' },
      { ingrediente_id: 'platano-maduro', cantidad: 0.5, unidad: 'unidad' },
      { ingrediente_id: 'tomate', cantidad: 0.06, unidad: 'kg' },
      { ingrediente_id: 'cebolla', cantidad: 0.04, unidad: 'kg' },
    ],
  },
  {
    id: 'casado-carne',
    nombre: 'Casado con carne',
    categoria: 'Plato fuerte',
    precio_venta: 4650,
    ingredientes: [
      { ingrediente_id: 'arroz', cantidad: 0.16, unidad: 'kg' },
      { ingrediente_id: 'frijoles', cantidad: 0.12, unidad: 'kg' },
      { ingrediente_id: 'carne-molida', cantidad: 0.18, unidad: 'kg' },
      { ingrediente_id: 'platano-maduro', cantidad: 0.5, unidad: 'unidad' },
      { ingrediente_id: 'chile-dulce', cantidad: 0.03, unidad: 'kg' },
      { ingrediente_id: 'cebolla', cantidad: 0.04, unidad: 'kg' },
    ],
  },
  {
    id: 'gallo-pinto',
    nombre: 'Gallo pinto',
    categoria: 'Desayuno',
    precio_venta: 2300,
    ingredientes: [
      { ingrediente_id: 'arroz', cantidad: 0.18, unidad: 'kg' },
      { ingrediente_id: 'frijoles', cantidad: 0.14, unidad: 'kg' },
      { ingrediente_id: 'cebolla', cantidad: 0.04, unidad: 'kg' },
      { ingrediente_id: 'chile-dulce', cantidad: 0.03, unidad: 'kg' },
      { ingrediente_id: 'natilla', cantidad: 0.04, unidad: 'kg' },
    ],
  },
  {
    id: 'sopa-negra',
    nombre: 'Sopa negra',
    categoria: 'Sopa',
    precio_venta: 2800,
    ingredientes: [
      { ingrediente_id: 'frijoles', cantidad: 0.22, unidad: 'kg' },
      { ingrediente_id: 'cebolla', cantidad: 0.05, unidad: 'kg' },
      { ingrediente_id: 'chile-dulce', cantidad: 0.04, unidad: 'kg' },
      { ingrediente_id: 'tomate', cantidad: 0.08, unidad: 'kg' },
    ],
  },
  {
    id: 'olla-carne',
    nombre: 'Olla de carne',
    categoria: 'Sopa',
    precio_venta: 5200,
    ingredientes: [
      { ingrediente_id: 'carne-molida', cantidad: 0.2, unidad: 'kg' },
      { ingrediente_id: 'papa', cantidad: 0.18, unidad: 'kg' },
      { ingrediente_id: 'cebolla', cantidad: 0.05, unidad: 'kg' },
      { ingrediente_id: 'chile-dulce', cantidad: 0.04, unidad: 'kg' },
      { ingrediente_id: 'platano-maduro', cantidad: 0.35, unidad: 'unidad' },
    ],
  },
  {
    id: 'arroz-leche',
    nombre: 'Arroz con leche',
    categoria: 'Postre',
    precio_venta: 1900,
    ingredientes: [
      { ingrediente_id: 'arroz', cantidad: 0.08, unidad: 'kg' },
      { ingrediente_id: 'leche', cantidad: 0.22, unidad: 'l' },
      { ingrediente_id: 'natilla', cantidad: 0.03, unidad: 'kg' },
    ],
  },
  {
    id: 'ceviche-corvina',
    nombre: 'Ceviche de corvina',
    categoria: 'Entrada',
    precio_venta: 4800,
    ingredientes: [
      { ingrediente_id: 'corvina', cantidad: 0.18, unidad: 'kg' },
      { ingrediente_id: 'cebolla', cantidad: 0.08, unidad: 'kg' },
      { ingrediente_id: 'chile-dulce', cantidad: 0.05, unidad: 'kg' },
      { ingrediente_id: 'tomate', cantidad: 0.07, unidad: 'kg' },
    ],
  },
  {
    id: 'picadillo-papa-carne',
    nombre: 'Picadillo de papa con carne',
    categoria: 'Plato fuerte',
    precio_venta: 3600,
    ingredientes: [
      { ingrediente_id: 'papa', cantidad: 0.22, unidad: 'kg' },
      { ingrediente_id: 'carne-molida', cantidad: 0.12, unidad: 'kg' },
      { ingrediente_id: 'cebolla', cantidad: 0.05, unidad: 'kg' },
      { ingrediente_id: 'chile-dulce', cantidad: 0.04, unidad: 'kg' },
      { ingrediente_id: 'aceite-vegetal', cantidad: 0.02, unidad: 'l' },
    ],
  },
];

export const recetas = recetasBase.map((recipe) => {
  const costo_calculado = calculateCost(recipe);

  return {
    ...recipe,
    costo_calculado,
    margen_pct: calculateMargin(recipe.precio_venta, costo_calculado),
  };
});
