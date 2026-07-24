"use client";

import { CircleCheck, TriangleAlert, X } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
import { Button } from "../button";
import { cx } from "../../utils";
import "./modal.css";

export type ModalVariant = "default" | "success" | "danger";
export type ModalSize = "medium" | "large";

export type ModalProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  cancelLabel?: string;
  children?: ReactNode;
  confirmLabel?: string;
  description?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  open: boolean;
  size?: ModalSize;
  title: ReactNode;
  variant?: ModalVariant;
};

export function Modal({
  cancelLabel = "Cancel",
  children,
  className,
  confirmLabel,
  description,
  onCancel,
  onConfirm,
  open,
  size = "medium",
  title,
  variant = "default",
  ...props
}: ModalProps) {
  if (!open) {
    return null;
  }

  const isDanger = variant === "danger";
  const isDialogue = variant !== "default";
  const actionLabel = confirmLabel ?? (isDanger ? "Delete" : "Confirm");

  return (
    <div
      aria-modal="true"
      className="r1c-modal-backdrop"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) {
          onCancel?.();
        }
      }}
      role="dialog"
    >
      <div
        className={cx(
          "r1c-modal",
          `r1c-modal--${size}`,
          isDialogue && "r1c-modal--dialogue",
          className,
        )}
        {...props}
      >
        <header className="r1c-modal__header">
          <div>
            <h2>{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <button
            aria-label="Close modal"
            className="r1c-modal__close"
            onClick={onCancel}
            type="button"
          >
            <X size={20} />
          </button>
        </header>

        <div className="r1c-modal__body">
          {isDialogue && (
            <div
              className={cx(
                "r1c-modal__status",
                `r1c-modal__status--${variant}`,
              )}
            >
              <span>
                {isDanger ? (
                  <TriangleAlert aria-hidden="true" size={28} />
                ) : (
                  <CircleCheck aria-hidden="true" size={28} />
                )}
              </span>
              {children ?? "dialogue message"}
            </div>
          )}
          {!isDialogue && children}
        </div>

        <footer className="r1c-modal__footer">
          {isDanger ? (
            <>
              <Button onClick={onConfirm} variant="danger">
                {actionLabel}
              </Button>
              <Button onClick={onCancel} variant="secondary">
                {cancelLabel}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={onCancel} variant="secondary">
                {cancelLabel}
              </Button>
              <Button onClick={onConfirm}>{actionLabel}</Button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
}
