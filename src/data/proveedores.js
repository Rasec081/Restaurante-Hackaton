// TODO: integrar scraping real con Playwright cuando SCRAPING_ENABLED=true
export const proveedores = [
  {
    id: 'walmart-cr',
    nombre: 'Walmart CR',
    url: 'https://www.walmart.co.cr/',
    productos_monitoreados: ['arroz', 'aceite-vegetal', 'harina', 'cebolla', 'platano-maduro', 'leche', 'papa'],
  },
  {
    id: 'pricesmart-cr',
    nombre: 'PriceSmart CR',
    url: 'https://www.pricesmart.com/site/cr/es',
    productos_monitoreados: ['pollo-entero', 'queso-mozzarella', 'natilla'],
  },
  {
    id: 'mayca',
    nombre: 'Mayca Distribuidora',
    url: 'https://www.mayca.com/',
    productos_monitoreados: ['frijoles', 'carne-molida', 'tomate', 'chile-dulce', 'corvina'],
  },
];
