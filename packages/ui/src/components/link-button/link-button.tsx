import type { ComponentProps } from "react";
import { cx } from "../../utils";
import "./link-button.css";

export type LinkButtonProps = ComponentProps<"a"> & {
  disabled?: boolean;
};

export function LinkButton({
  children,
  className,
  disabled = false,
  onClick,
  tabIndex,
  ...props
}: LinkButtonProps) {
  return (
    <a
      aria-disabled={disabled || undefined}
      className={cx("r1c-link-button", className)}
      onClick={disabled ? (event) => event.preventDefault() : onClick}
      tabIndex={disabled ? -1 : tabIndex}
      {...props}
    >
      {children}
    </a>
  );
}
