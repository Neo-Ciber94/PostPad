export interface LoadingSpinnerProps {
  size?: number;
  width?: number;
  color?: string;
}

export default function LoadingSpinner({
  size = 30,
  width = 4,
  color = "white",
}: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center">
      <div
        className="inline-block animate-spin rounded-full  border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
        style={{
          height: size,
          width: size,
          borderWidth: width,
          color,
        }}
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  );
}
