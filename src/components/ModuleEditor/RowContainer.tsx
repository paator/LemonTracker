import classNames from "classnames";
import { useBoundStore } from "../../stores";
import React from "react";

type RowContainerProps = {
  yPositionInGrid: number;
  className?: string;
  children: React.ReactNode;
};

function RowContainer({
  yPositionInGrid,
  children,
  className,
}: RowContainerProps) {
  const { posY } = useBoundStore((state) => ({ posY: state.posY }));

  const classes = classNames(
    {
      "text-blue-300": yPositionInGrid! % 4,
      "text-blue-200": yPositionInGrid % 4 === 0,
      "bg-blue-800": posY === yPositionInGrid,
      "bg-slate-700": yPositionInGrid % 4 === 0 && posY !== yPositionInGrid,
    },
    className,
    "px-2"
  );

  return <span className={classes}>{children}</span>;
}

export default RowContainer;
