const styles = {
  Alerta: 'bg-red-100 text-red-700 ring-red-200',
  Vigilar: 'bg-amber-100 text-amber-800 ring-amber-200',
  Normal: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  Oportunidad: 'bg-blue-100 text-blue-700 ring-blue-200',
};

export default function PriceAlertBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${styles[status]}`}
    >
      {status}
    </span>
  );
}
