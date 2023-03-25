import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Single_Day } from "next/font/google";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Avatar from "./Avatar";
import Menu from "./Menu";

const singleDay = Single_Day({
  weight: "400",
});

export interface HeaderProps {
  session: Session | null;
}

export default function Header({ session }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header>
      <nav
        className="sticky z-10 flex h-16 w-full flex-row
            items-center justify-between bg-[#282a36] px-8 shadow-md"
      >
        <Link href={"/"}>
          <Logo />
        </Link>

        {!session?.user && pathname != "/" && <LoginButton />}
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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSignOut = async () => {
    signOut({ callbackUrl: "/" }).catch(console.error);
    handleClose();
  };

  return (
    <>
      <Menu onClose={handleClose} onClick={handleOpen} open={open}>
        <Avatar
          alt={user.name || user.email || "me"}
          src={user.image || "/default-user.png"}
        />

        <Menu.List className="absolute right-0 top-10 z-40 min-w-[150px] rounded-md bg-white p-1 shadow-lg">
          <Menu.Item
            className="hover:bg-base-100 flex cursor-pointer flex-row items-center gap-2 px-4 py-2 text-black hover:rounded-lg"
            onClick={handleSignOut}
          >
            Sign Out
          </Menu.Item>
        </Menu.List>
      </Menu>
    </>
  );
}

function LoginButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/")}
      className="bg-base-500 hover:bg-base-400 flex flex-row items-center gap-2 rounded-lg p-2 text-white shadow transition-all duration-300 hover:scale-90"
    >
      <span>
        <ArrowRightOnRectangleIcon className="h-6 w-6" />
      </span>
      <span>Login</span>
    </button>
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
