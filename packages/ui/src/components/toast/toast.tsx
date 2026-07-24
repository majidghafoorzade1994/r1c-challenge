import type { HTMLAttributes } from "react";
import { cx } from "../../utils";
import "./toast.css";

export type ToastVariant = "success" | "error";

export type ToastProps = HTMLAttributes<HTMLDivElement> & {
  description?: string;
  title: string;
  variant?: ToastVariant;
};

export function Toast({
  className,
  description,
  title,
  variant = "success",
  ...props
}: ToastProps) {
  return (
    <div
      className={cx("r1c-toast", `r1c-toast--${variant}`, className)}
      role={variant === "error" ? "alert" : "status"}
      {...props}
    >
      <strong>{title}</strong>
      {description && <span>{description}</span>}
    </div>
  );
}
