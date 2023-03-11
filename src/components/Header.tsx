import { Single_Day } from "next/font/google";
import Link from "next/link";

const singleDay = Single_Day({
  weight: "400",
});

export default function Header() {
  return (
    <header>
      <nav
        className="sticky z-10 flex h-16 w-full flex-row
            items-center bg-[#282a36] px-4 shadow-md"
      >
        <Link href={"/"}>
          <Logo />
        </Link>
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
      Notevine
    </h1>
  );
}
