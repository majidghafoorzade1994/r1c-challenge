import { forwardRef } from "react";
import type { ComponentProps } from "react";
import { cx } from "../../utils";
import "./textarea.css";

export type TextareaProps = ComponentProps<"textarea"> & {
  invalid?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, invalid = false, ...props }, ref) {
    return (
      <textarea
        aria-invalid={invalid || undefined}
        className={cx("r1c-textarea", className)}
        ref={ref}
        {...props}
      />
    );
  },
);
