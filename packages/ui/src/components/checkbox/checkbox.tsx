"use client";

import { Check, Minus } from "lucide-react";
import type { ComponentProps } from "react";
import { useEffect, useRef } from "react";
import { cx } from "../../utils";
import "./checkbox.css";

export type CheckboxProps = Omit<ComponentProps<"input">, "type"> & {
  indeterminate?: boolean;
};

export function Checkbox({
  className,
  indeterminate = false,
  ...props
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <span className={cx("r1c-checkbox", className)}>
      <input ref={inputRef} type="checkbox" {...props} />
      <span aria-hidden="true" className="r1c-checkbox__control">
        {indeterminate ? <Minus size={14} /> : <Check size={14} />}
      </span>
    </span>
  );
}
