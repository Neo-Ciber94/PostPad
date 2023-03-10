export interface BackdropProps {
  zIndex?: number;
  blur?: number;
  opacity?: number;
  onClick?: () => void;
}
export default function Backdrop(props: BackdropProps) {
  const { zIndex = 20, blur = 2, opacity = 0.7, onClick } = props;

  return (
    <div
      onClick={onClick}
      className="absolute inset-0 z-20 h-full w-full"
      style={{
        zIndex,
        backdropFilter: `blur(${blur}px)`,
      }}
    >
      <div className="inset-0 h-full w-full bg-black" style={{ opacity }}></div>
    </div>
  );
}
