import { useSession, signOut } from "next-auth/react";
import { Single_Day } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import Avatar from "./Avatar";
import { Menu, MenuItem } from "./Menu";

const singleDay = Single_Day({
  weight: "400",
});

export default function Header() {
  const { data: session } = useSession();

  return (
    <header>
      <nav
        className="sticky z-10 flex h-16 w-full flex-row
            items-center justify-between bg-[#282a36] px-4 shadow-md"
      >
        <Link href={"/"}>
          <Logo />
        </Link>

        {session?.user && <UserAvatar user={session?.user} />}
      </nav>
    </header>
  );
}

type UserSession = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export interface UserAvatarProps {
  user: UserSession;
}

function UserAvatar({ user }: UserAvatarProps) {
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

  const handleSignOut = () => {
    signOut();
  };

  return (
    <>
      <button onClick={handleOpen}>
        <Avatar
          alt={user.name || user.email || "me"}
          src={user.image || "/default-user.png"}
        />
      </button>
      <Menu open={open} anchor={anchor} onClose={handleClose}>
        <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
      </Menu>
    </>
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
