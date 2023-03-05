export interface ChipProps {
  value: string;
  color?: string;
  backgroundColor?: string;
  className?: string;
}

export default function Chip(props: ChipProps) {
  const { value, backgroundColor, color, className } = props;

  return (
    <div
      className={`flex flex-row items-center gap-2 rounded-xl px-3 py-1 ${className}`}
      style={{
        backgroundColor: backgroundColor || "black",
        color: color || "white",
      }}
    >
      <span className="break-all outline-none">{value}</span>
    </div>
  );
}
