import { useOuterClick } from "@/lib/client/hooks/useOuterClick";
import { createContext, PropsWithChildren, useContext, useRef } from "react";

export interface MenuButtonProps {
  open: boolean;
  onClick: () => void;
  onClose: () => void;
}

type MenuButtonContextProps = { open: boolean };
const MenuButtonContext = createContext<MenuButtonContextProps>(
  {} as MenuButtonContextProps
);

export type MenuButtonListComponent = React.FC<
  PropsWithChildren<MenuButtonListProps>
>;

export type MenuButtonItemComponent = React.FC<
  PropsWithChildren<MenuButtonItemProps>
>;

export type MenuButtonComponent = React.FC<
  PropsWithChildren<MenuButtonProps>
> & {
  List: MenuButtonListComponent;
  Item: MenuButtonItemComponent;
};

const MenuButton: MenuButtonComponent = ({
  children,
  open,
  onClose,
  onClick,
}) => {
  const curRef = useRef<HTMLButtonElement | null>(null);

  useOuterClick({
    ref: curRef,
    onClickOutside() {
      if (open) {
        onClose();
      }
    },
  });

  return (
    <MenuButtonContext.Provider value={{ open }}>
      <button
        ref={curRef}
        className="relative"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }}
      >
        {children}
      </button>
    </MenuButtonContext.Provider>
  );
};

export type MenuButtonListProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLUListElement>,
  HTMLUListElement
>;

const List: React.FC<PropsWithChildren<MenuButtonListProps>> = ({
  children,
  ...props
}) => {
  const { open } = useContext(MenuButtonContext);

  if (!open) {
    return <></>;
  }

  return <ul {...props}>{children}</ul>;
};

export type MenuButtonItemProps = React.DetailedHTMLProps<
  React.LiHTMLAttributes<HTMLLIElement>,
  HTMLLIElement
>;

const Item: React.FC<PropsWithChildren<MenuButtonItemProps>> = ({
  children,
  ...props
}) => <li {...props}>{children}</li>;

MenuButton.List = List;
MenuButton.Item = Item;

export default MenuButton;
