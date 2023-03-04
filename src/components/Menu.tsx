import { useOuterClick } from "@/hooks/useOuterClick";
import { useRef, useState, useEffect, PropsWithChildren } from "react";

export interface MenuProps {
  open: boolean;
  anchor: React.RefObject<HTMLElement>;
  onClose: () => void;
}

type Position = { top: number; left: number };

export const Menu: React.FC<PropsWithChildren<MenuProps>> = ({
  children,
  ...props
}) => {
  const { open, onClose, anchor } = props;
  const curRef = useRef<HTMLDivElement | null>(null);

  useOuterClick({
    ref: curRef,
    onClickOutside() {
      if (open) {
        console.log("close");
        onClose();
      }
    },
  });

  const [pos, setPos] = useState<Position | null>(null);

  useEffect(() => {
    const moveMenu = () => {
      const boundingRect = anchor.current?.getBoundingClientRect();

      if (boundingRect == null) {
        return;
      }

      const top = boundingRect.top + boundingRect.height;
      const left = boundingRect.left - boundingRect.width;
      console.log({ top, left });
      setPos({ top, left });
    };

    moveMenu();
    window.addEventListener("resize", moveMenu);
    return () => {
      window.removeEventListener("resize", moveMenu);
    };
  }, [anchor]);

  return (
    <>
      <div
        ref={curRef}
        className="absolute top-5 left-[-80px] z-50 w-[120px] rounded-md bg-white py-1 shadow-sm"
        style={{
          display: open ? undefined : "none",
          top: pos?.top,
          left: pos?.left,
        }}
      >
        <ul>{children}</ul>
      </div>
    </>
  );
};

export type MenuItemProps = React.DetailedHTMLProps<
  React.LiHTMLAttributes<HTMLLIElement>,
  HTMLLIElement
>;

export const MenuItem: React.FC<PropsWithChildren<MenuItemProps>> = ({
  children,
  ...props
}) => {
  const { className = "", ...rest } = props || {};

  return (
    <li
      className={`cursor-pointer px-2 py-1 hover:bg-slate-300 ${className}`}
      {...rest}
    >
      <button className={`text-black`}>{children}</button>
    </li>
  );
};
