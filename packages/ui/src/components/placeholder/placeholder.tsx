import type { HTMLAttributes } from "react";
import { cx } from "../../utils";
import "./placeholder.css";

export type PlaceholderProps = HTMLAttributes<HTMLDivElement>;

export function Placeholder({
  children = "Replace me",
  className,
  ...props
}: PlaceholderProps) {
  return (
    <div className={cx("r1c-placeholder", className)} {...props}>
      {children}
    </div>
  );
}
