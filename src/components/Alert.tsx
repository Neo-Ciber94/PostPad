import React, { PropsWithChildren } from "react";
import Color from "color";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

export interface AlertProps {
  color: string;
}

const Alert: React.FC<PropsWithChildren<AlertProps>> = ({
  children,
  ...props
}) => {
  const { color } = props;
  return (
    <div
      className="flex flex-row items-center rounded-md border-2 bg-gray-800 p-3"
      style={{ borderColor: color, color: Color(color).lighten(0.5).hex() }}
    >
      <div className="pr-2">
        <ExclamationCircleIcon
          className="h-8 w-8"
          style={{ color: Color(color).lighten(0.2).hex() }}
        />
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Alert;
