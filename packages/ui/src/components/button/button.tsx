"use client";

import { CircleCheck } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { Spinner } from "../spinner";
import { cx } from "../../utils";
import "./button.css";

export type ButtonVariant = "primary" | "secondary" | "danger";

export type ButtonProps = ComponentProps<"button"> & {
  icon?: ReactNode;
  iconOnly?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
};

export function Button({
  children,
  className,
  disabled,
  icon,
  iconOnly = false,
  loading = false,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const fallbackIcon = <CircleCheck aria-hidden="true" size={20} />;

  return (
    <button
      aria-busy={loading || undefined}
      className={cx(
        "r1c-button",
        `r1c-button--${variant}`,
        iconOnly && "r1c-button--icon",
        className,
      )}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          {iconOnly ? icon ?? fallbackIcon : icon}
          {!iconOnly && children}
        </>
      )}
    </button>
  );
}
