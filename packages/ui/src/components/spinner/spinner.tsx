import type { HTMLAttributes } from "react";
import { cx } from "../../utils";
import "./spinner.css";

export type SpinnerProps = HTMLAttributes<HTMLSpanElement>;

export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <span
      aria-hidden="true"
      className={cx("r1c-spinner", className)}
      {...props}
    />
  );
}
