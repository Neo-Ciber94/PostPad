import React from "react";
import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export type ButtonVariant = "primary" | "secondary" | "error" | "accent";

export interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: ButtonVariant;
}

export default function Button({
  children,
  ...rest
}: PropsWithChildren<ButtonProps>) {
  const { variant, disabled = false, className } = rest;
  const variantClassName = getVariantClassName({ variant, disabled }) || "";

  // @tw
  const baseButtonClassName = `flex min-w-[100px] flex-row items-center justify-center rounded px-6 py-2 
  shadow-md transition duration-300`;

  return (
    <button
      {...rest}
      className={twMerge(baseButtonClassName, variantClassName, className)}
    >
      {children}
    </button>
  );
}

interface GetVariantClassNameOptions {
  variant: ButtonVariant | undefined | null;
  disabled: boolean;
}

function getVariantClassName(options: GetVariantClassNameOptions) {
  const { variant, disabled } = options;

  if (variant == null) {
    return null;
  }

  switch (variant) {
    case "primary": {
      // @tw
      return `bg-[#6272a4] text-white outline-none ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "focus:ring-2 ring-[#54618d] hover:bg-[#394364] "
      }`;
    }
    case "secondary": {
      // @tw
      return `bg-base-700 text-white outline-none ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "focus:ring-2 ring-base-400 hover:bg-base-800 "
      }`;
    }
    case "accent": {
      // @tw
      return `bg-accent-500 text-black outline-none ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "focus:ring-2 ring-accent-400 hover:brightness-75 "
      }`;
    }
    case "error": {
      // @tw
      return `bg-error-800 text-white outline-none ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "focus:ring-2 ring-error-700 hover:bg-error-900 "
      }`;
    }
    default:
      return null;
  }
}
