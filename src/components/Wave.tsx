/**
 * From: https://github.com/woofers/react-wavify/blob/main/src/wave.js
 */

import React, {
  CSSProperties,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";

type Point = { x: number; y: number };

export interface WaveOptions {
  height?: number;
  amplitude?: number;
  speed?: number;
  points?: number;
}

export interface WaveProps {
  id?: string;
  paused?: boolean;
  style?: CSSProperties;
  className?: string;
  fill?: string;
  svgId?: string;
  svgPathId?: string;
  svgProps?: React.SVGProps<SVGPathElement>;
  options?: WaveOptions;
}

interface WaveState {
  points: Point[];
  lastUpdate: number;
  elapsed: number;
  step: number;
}

const Wave: React.FC<PropsWithChildren<WaveProps>> = ({
  children,
  ...props
}) => {
  const {
    id,
    fill = "#fff",
    style,
    paused = false,
    className,
    svgId,
    svgPathId,
    svgProps,
  } = props;
  const options = {
    height: 20,
    amplitude: 20,
    speed: 0.15,
    points: 3,
    ...props.options,
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [path, setPath] = useState("");
  const frameIdRef = useRef<number | null>(null);
  const { current: frameId } = frameIdRef;

  const { current: state } = useRef<WaveState>({
    lastUpdate: 0,
    elapsed: 0,
    step: 0,
    points: [],
  });

  const getWidth = () => containerRef.current?.offsetWidth || 0;
  const getHeight = () => containerRef.current?.offsetHeight || 0;

  function draw() {
    if (!paused) {
      const now = Date.now();
      state.elapsed += now - state.lastUpdate;
      state.lastUpdate = now;
    }
    const scale = 1000;
    state.step = (state.elapsed * Math.PI) / scale;
    const points = calculateWavePoints(options, state.step, getWidth());
    const path = buildPath(points, getWidth(), getHeight());
    setPath(path);
  }

  function updateCallback() {
    draw();
    if (frameId) {
      resume();
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function resume() {
    frameIdRef.current = window.requestAnimationFrame(updateCallback);
    state.lastUpdate = Date.now();
  }

  useEffect(() => {
    if (!frameId) {
      resume();
    }
    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
        frameIdRef.current = 0;
      }
    };
  }, [frameId, resume]);

  return (
    <div
      style={{ width: "100%", display: "inline-block", ...style }}
      className={className}
      id={id}
      ref={containerRef}
    >
      <svg
        width="100%"
        height="100%"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        id={svgId}
      >
        {children}
        <path
          {...Object.assign({}, { d: path, fill }, svgProps)}
          id={svgPathId}
        />
      </svg>
    </div>
  );
};

function calculateWavePoints(
  options: Required<WaveOptions>,
  step: number,
  width: number
) {
  const points: Point[] = [];
  for (let i = 0; i <= Math.max(options.points, 1); i++) {
    const scale = 100;
    const x = (i / options.points) * width;
    const seed = (step + (i + (i % options.points))) * options.speed * scale;
    const height = Math.sin(seed / scale) * options.amplitude;
    const y = Math.sin(seed / scale) * height + options.height;
    points.push({ x, y });
  }
  return points;
}

function buildPath(points: Point[], width: number, height: number) {
  let svg = `M ${points[0].x} ${points[0].y}`;
  const initial = {
    x: (points[1].x - points[0].x) / 2,
    y: points[1].y - points[0].y + points[0].y + (points[1].y - points[0].y),
  };
  const cubic = (a: Point, b: Point) =>
    ` C ${a.x} ${a.y} ${a.x} ${a.y} ${b.x} ${b.y}`;
  svg += cubic(initial, points[1]);
  let point = initial;
  for (let i = 1; i < points.length - 1; i++) {
    point = {
      x: points[i].x - point.x + points[i].x,
      y: points[i].y - point.y + points[i].y,
    };
    svg += cubic(point, points[i + 1]);
  }
  svg += ` L ${width} ${height}`;
  svg += ` L 0 ${height} Z`;
  return svg;
}

export default Wave;
