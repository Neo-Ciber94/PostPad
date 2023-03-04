import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export type SearchInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export default function SearchInput(props: SearchInputProps) {
  return (
    <div className="relative">
      <input
        {...props}
        type="search"
        placeholder="Search..."
        className="h-10 w-full rounded-lg bg-white pr-4
            pl-14 text-black outline-none shadow-md shadow-gray-800"
      />
      <div className="absolute top-2 left-4 cursor-pointer">
        <MagnifyingGlassIcon className="h-6 w-6 text-gray-600 opacity-80" />
      </div>
    </div>
  );
}
