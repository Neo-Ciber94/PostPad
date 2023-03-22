import { useOuterClick } from "@/lib/client/hooks/useOuterClick";
import { useRef, useState, useEffect, PropsWithChildren } from "react";

export interface MenuProps {
  open: boolean;
  anchor: HTMLElement | null;
  leftOffset?: number;
  topOffset?: number;
  onClose: () => void;
}

type Position = { top: number; left: number };

export const Menu: React.FC<PropsWithChildren<MenuProps>> = ({
  children,
  leftOffset = 40,
  topOffset = 0,
  ...props
}) => {
  const { open, onClose, anchor } = props;
  const curRef = useRef<HTMLDivElement | null>(null);

  useOuterClick({
    ref: curRef,
    onClickOutside() {
      if (open) {
        onClose();
      }
    },
  });

  const [pos, setPos] = useState<Position | null>(null);

  useEffect(() => {
    const moveMenu = () => {
      const boundingRect = anchor?.getBoundingClientRect();

      if (boundingRect == null) {
        return;
      }

      // FIXME: We could add cuRef.current.getBoundingClientRect().width / 2
      // to ensure the menu show in the left, but I haven't found a way to do it
      const top = boundingRect.top + boundingRect.height - topOffset;
      const left = boundingRect.left - boundingRect.width - leftOffset;

      setPos({ top, left });
    };

    moveMenu();
    window.addEventListener("resize", moveMenu);
    return () => {
      window.removeEventListener("resize", moveMenu);
    };
  }, [anchor, leftOffset, topOffset]);

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
      className={`cursor-pointer px-2 py-1 text-black hover:bg-slate-300 ${className}`}
      {...rest}
    >
      {children}
    </li>
  );
};
