import { BarChart3, ChefHat, ClipboardList, Settings, Utensils } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Inicio', icon: BarChart3 },
  { to: '/auditoria', label: 'Auditoría', icon: ClipboardList },
  { to: '/recetas', label: 'Platillos', icon: ChefHat },
  { to: '/configuracion', label: 'Configuración', icon: Settings },
];

export default function Navbar() {
  return (
    <aside className="border-b border-stone-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-3 px-4 py-4 lg:px-6 lg:py-7">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-slate-800 text-white">
          <Utensils size={22} />
        </div>
        <div>
          <p className="text-lg font-bold text-slate-800">Soscio</p>
          <p className="text-xs font-medium text-stone-500">Audita tus insumos.</p>
        </div>
      </div>
      <nav className="flex gap-2 overflow-x-auto px-3 pb-4 lg:flex-col lg:px-4">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                'focus-ring flex min-w-max items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition',
                isActive
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-cacao',
              ].join(' ')
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
