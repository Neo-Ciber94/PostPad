import { useOuterClick } from "@/lib/client/hooks/useOuterClick";
import { createContext, PropsWithChildren, useContext, useRef } from "react";

export interface MenuProps {
  open: boolean;
  onClick: (event: React.MouseEvent) => void;
  onClose: () => void;
}

type MenuContextProps = { open: boolean };
const MenuButtonContext = createContext<MenuContextProps>(
  {} as MenuContextProps
);

export type MenuListComponent = React.FC<PropsWithChildren<MenuListProps>>;

export type MenuItemComponent = React.FC<PropsWithChildren<MenuItemProps>>;

export type MenuComponent = React.FC<PropsWithChildren<MenuProps>> & {
  List: MenuListComponent;
  Item: MenuItemComponent;
};

const Menu: MenuComponent = ({ children, open, onClose, onClick }) => {
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
          onClick(e);
        }}
      >
        {children}
      </button>
    </MenuButtonContext.Provider>
  );
};

export type MenuListProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLUListElement>,
  HTMLUListElement
>;

const List: React.FC<PropsWithChildren<MenuListProps>> = ({
  children,
  ...props
}) => {
  const { open } = useContext(MenuButtonContext);

  if (!open) {
    return <></>;
  }

  return <ul {...props}>{children}</ul>;
};

export type MenuItemProps = React.DetailedHTMLProps<
  React.LiHTMLAttributes<HTMLLIElement>,
  HTMLLIElement
>;

const Item: React.FC<PropsWithChildren<MenuItemProps>> = ({
  children,
  ...props
}) => <li {...props}>{children}</li>;

Menu.List = List;
Menu.Item = Item;

export default Menu;
