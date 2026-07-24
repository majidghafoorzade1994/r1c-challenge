import { forwardRef } from "react";
import type { ComponentProps } from "react";
import { cx } from "../../utils";
import "./input.css";

export type InputProps = ComponentProps<"input"> & {
  invalid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid = false, ...props },
  ref,
) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cx("r1c-input", className)}
      ref={ref}
      {...props}
    />
  );
});
