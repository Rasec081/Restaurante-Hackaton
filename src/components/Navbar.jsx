import { BarChart3, ChefHat, ClipboardList, Settings, Utensils } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Inicio', icon: BarChart3 },
  { to: '/auditoria?estado=Alerta', label: 'Auditoría', icon: ClipboardList },
  { to: '/recetas?filtro=alerta', label: 'Platillos', icon: ChefHat },
  { to: '/configuracion', label: 'Configuración', icon: Settings },
];

export default function Navbar({ isOpen, onOpen, onClose }) {
  return (
    <aside
      className={`z-30 border-b border-stone-200 bg-white transition-all duration-300 lg:fixed lg:inset-y-0 lg:left-0 lg:border-b-0 lg:border-r ${
        isOpen ? 'lg:w-56 lg:shadow-2xl' : 'lg:w-16'
      }`}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <Link
        to="/"
        className={`focus-ring flex items-center gap-3 px-4 py-4 lg:py-5 ${isOpen ? 'lg:px-5' : 'lg:justify-center lg:px-2'}`}
        aria-label="Ir al inicio"
      >
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-800 text-white">
          <Utensils size={20} />
        </div>
        {isOpen && (
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-slate-800">Soscio</p>
            <p className="truncate text-xs font-medium text-stone-500">Food Cost Intelligence</p>
          </div>
        )}
      </Link>

      <nav className={`flex gap-1.5 overflow-x-auto px-3 pb-4 lg:flex-col ${isOpen ? 'lg:px-3' : 'lg:items-center lg:px-2'}`}>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              [
                'focus-ring flex min-w-max items-center rounded-lg py-2 text-sm font-semibold transition',
                isOpen ? 'gap-2.5 px-3' : 'justify-center px-2 lg:h-10 lg:w-10',
                isActive
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-cacao',
              ].join(' ')
            }
          >
            <Icon size={17} />
            {isOpen && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
