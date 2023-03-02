import React from "react";
import { PropsWithChildren, ReactHTML } from "react";

type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export default function Button({ children, className, ...rest }: PropsWithChildren<ButtonProps>) {
    return <button
        className={`rounded px-6 py-2 text-white shadow-m 
        bg-gray-800 hover:bg-gray-900 transition-colors duration-300 
            focus:ring-2 focus:ring-gray-500 ${className}`} {...rest}>
        {children}
    </button>;
}