export interface ChipProps {
  value: string;
  className?: string;
}

export default function Chip(props: ChipProps) {
  const { value, className = "bg-black text-white" } = props;

  return (
    <div
      className={`flex flex-row items-center gap-2 rounded-xl px-4 py-1 ${className}`}
    >
      <span className="break-all text-sm outline-none">{value}</span>
    </div>
  );
}
