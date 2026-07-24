import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils";
import "./field.css";

export type FieldProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  error?: string;
  htmlFor?: string;
  label: string;
  required?: boolean;
};

export function Field({
  children,
  className,
  error,
  htmlFor,
  label,
  required = false,
  ...props
}: FieldProps) {
  return (
    <div className={cx("r1c-field", className)} {...props}>
      <label className="r1c-field__label" htmlFor={htmlFor}>
        {label}
        {required && <span aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p className="r1c-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
