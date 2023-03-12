import { Single_Day } from "next/font/google";
import Link from "next/link";
import { useRef, useState } from "react";
import Avatar from "./Avatar";
import { Menu, MenuItem } from "./Menu";

const singleDay = Single_Day({
  weight: "400",
});

export default function Header() {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const handleOpen = (e: React.MouseEvent) => {
    setAnchor(e.target as HTMLElement);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAnchor(null);
  };

  return (
    <header>
      <nav
        className="sticky z-10 flex h-16 w-full flex-row
            items-center justify-between bg-[#282a36] px-4 shadow-md"
      >
        <Link href={"/"}>
          <Logo />
        </Link>

        <button onClick={handleOpen}>
          <Avatar
            alt="Not found"
            src={
              "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png"
            }
          />
        </button>

        <Menu open={open} anchor={anchor} onClose={handleClose}>
          <MenuItem onClick={() => console.log("Log out")}>Logout</MenuItem>
        </Menu>
      </nav>
    </header>
  );
}

function Logo() {
  return (
    <h1
      className={`cursor-pointer text-3xl text-white`}
      style={singleDay.style}
    >
      PostPad
    </h1>
  );
}
