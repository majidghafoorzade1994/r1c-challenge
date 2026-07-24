import type { ComponentProps } from "react";

export type ButtonProps = ComponentProps<"button">;

export function Button({
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button type={type} {...props}>
      {children}
    </button>
  );
}
