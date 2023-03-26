import { PropsWithChildren, useRef, useState, useEffect } from "react";

type Position = {
  x: number;
  y: number;
};

export interface RelativeProps {
  anchor: HTMLElement | null;
  visible: boolean;
  offsetX?: number;
  offsetY?: number;
  className?: string;
}

/**
 * Position the children element relative to the anchor element.
 */
export function Relative(props: PropsWithChildren<RelativeProps>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const { anchor, children, offsetX = 0, offsetY = 0, className } = props;
  const [visible, setVisible] = useState(props.visible);
  const [pos, setPos] = useState<Position | null>(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const width = entry.contentRect.width;
      setContainerWidth(width);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [containerRef]);

  useEffect(() => {
    if (!props.visible) {
      setVisible(false);
    }

    const updatePosition = () => {
      const rect = anchor?.getBoundingClientRect();

      if (rect == null || containerWidth === 0) {
        return;
      }

      const left = window.scrollX + rect.left + offsetX - containerWidth;
      const top = window.scrollY + rect.top + offsetY;
      setPos({ x: left, y: top });

      if (props.visible) {
        setVisible(true);
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, [props.visible, containerWidth, anchor, offsetX, offsetY]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "absolute",
        visibility: visible ? "visible" : "hidden",
        left: pos?.x,
        top: pos?.y,
      }}
    >
      {children}
    </div>
  );
}
