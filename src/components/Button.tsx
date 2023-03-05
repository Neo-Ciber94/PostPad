import React from "react";
import { PropsWithChildren } from "react";

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export default function Button({
  children,
  className,
  ...rest
}: PropsWithChildren<ButtonProps>) {
  const { disabled = false } = rest;

  return (
    <button
      className={`shadow-m rounded bg-gray-800 px-6 py-2 
        text-white transition-colors duration-300
            focus:ring-2 focus:ring-gray-500 ${
              disabled ? "opacity-50" : "hover:bg-gray-900 "
            } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
