const styles = {
  Alerta: 'bg-[#FF5151]/10 text-[#FF5151] ring-[#FF5151]/20',
  Vigilar: 'bg-[#FDBA2D]/15 text-[#FDBA2D] ring-[#FDBA2D]/25',
  Normal: 'bg-[#20C66B]/10 text-[#20C66B] ring-[#20C66B]/20',
  Oportunidad: 'bg-[#10213D]/10 text-[#10213D] ring-navy/20',
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
