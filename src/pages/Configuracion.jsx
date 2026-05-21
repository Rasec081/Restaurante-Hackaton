import { Building2, Lock, SlidersHorizontal } from 'lucide-react';
import { useAuditConfig } from '../App.jsx';
import { proveedores } from '../data/proveedores.js';

export default function Configuracion() {
  const { alertThreshold, setAlertThreshold, targetMargin, setTargetMargin } = useAuditConfig();

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm font-bold text-[#20C66B]">Configuración</p>
        <h1 className="mt-1 text-3xl font-bold text-cacao">Reglas del auditor</h1>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <Control
          icon={SlidersHorizontal}
          title="Umbral de alerta"
          value={alertThreshold}
          suffix="%"
          min={6}
          max={22}
          onChange={setAlertThreshold}
        />
        <Control
          icon={SlidersHorizontal}
          title="Margen objetivo"
          value={targetMargin}
          suffix="%"
          min={45}
          max={75}
          onChange={setTargetMargin}
        />
      </section>

      <section className="panel rounded-lg p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-stone-100 text-[#10213D]">
            <Building2 size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-cacao">Proveedores monitoreados</h2>
            <p className="text-sm text-stone-500">Datos simulados para demostración del MVP.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {proveedores.map((supplier) => (
            <article key={supplier.id} className="rounded-lg border border-stone-200 p-4">
              <h3 className="font-bold text-cacao">{supplier.nombre}</h3>
              <a className="mt-1 block break-all text-sm font-semibold text-[#10213D]" href={supplier.url}>
                {supplier.url}
              </a>
              <p className="mt-3 text-sm text-stone-600">
                {supplier.productos_monitoreados.length} productos monitoreados
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel rounded-lg p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-stone-100 text-stone-500">
              <Lock size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-cacao">Scraping</h2>
              <p className="text-sm text-stone-500">Integración con proveedores disponible próximamente</p>
            </div>
          </div>
          <button
            className="relative h-7 w-12 cursor-not-allowed rounded-full bg-stone-300"
            disabled
            aria-label="Scraping desactivado"
          >
            <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow" />
          </button>
        </div>
      </section>
    </div>
  );
}

function Control({ icon: Icon, title, value, suffix, min, max, onChange }) {
  return (
    <section className="panel rounded-lg p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-stone-100 text-[#10213D]">
            <Icon size={20} />
          </div>
          <h2 className="font-bold text-cacao">{title}</h2>
        </div>
        <span className="text-2xl font-bold text-[#10213D]">
          {value}
          {suffix}
        </span>
      </div>
      <input
        className="mt-5 w-full accent-[#10213D]"
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className="mt-2 flex justify-between text-xs font-semibold text-stone-500">
        <span>
          {min}
          {suffix}
        </span>
        <span>
          {max}
          {suffix}
        </span>
      </div>
    </section>
  );
}
