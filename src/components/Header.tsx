import { Single_Day } from 'next/font/google';
import Link from 'next/link';

const singleDay = Single_Day({
    weight: '400'
})

export default function Header() {
    return <header >
        <nav className="sticky border-[rgba(255,255,255,0.2)] 
    border-b h-14 w-full shadow-md bg-[#141414]
    flex flex-row items-center p-2 z-10">
            <Link href={"/"} >
                <Logo />
            </Link>
        </nav>
    </header>;
}

function Logo() {
    return <h1 className={`text-white text-3xl cursor-pointer`} style={singleDay.style}>Notevine</h1>
}