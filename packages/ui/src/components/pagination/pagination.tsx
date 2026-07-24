"use client";

import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils";
import "./pagination.css";

type PaginationItem = number | "ellipsis-start" | "ellipsis-end";

function getPaginationItems(current: number, total: number): PaginationItem[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages = new Set([1, total, current - 1, current, current + 1]);

  if (current <= 4) {
    [2, 3, 4, 5].forEach((page) => pages.add(page));
  }

  if (current >= total - 3) {
    [total - 4, total - 3, total - 2, total - 1].forEach((page) =>
      pages.add(page),
    );
  }

  const sorted = [...pages]
    .filter((page) => page > 0 && page <= total)
    .sort((a, b) => a - b);
  const result: PaginationItem[] = [];

  sorted.forEach((page, index) => {
    const previous = sorted[index - 1];
    if (previous && page - previous > 1) {
      result.push(index === 1 ? "ellipsis-start" : "ellipsis-end");
    }
    result.push(page);
  });

  return result;
}

export type PaginationProps = Omit<
  HTMLAttributes<HTMLElement>,
  "onChange"
> & {
  currentPage: number;
  disabled?: boolean;
  onPageChange?: (page: number) => void;
  totalPages: number;
};

export function Pagination({
  className,
  currentPage,
  disabled = false,
  onPageChange,
  totalPages,
  ...props
}: PaginationProps) {
  const current = Math.min(Math.max(currentPage, 1), Math.max(totalPages, 1));
  const items = getPaginationItems(current, Math.max(totalPages, 1));

  const renderControl = (
    label: string,
    content: ReactNode,
    page: number,
    controlDisabled: boolean,
  ) => (
    <button
      aria-label={label}
      className="r1c-pagination__item"
      disabled={disabled || controlDisabled}
      onClick={() => onPageChange?.(page)}
      type="button"
    >
      {content}
    </button>
  );

  return (
    <nav
      aria-label="Pagination"
      className={cx("r1c-pagination", className)}
      {...props}
    >
      {renderControl("Previous page", <ChevronLeft size={18} />, current - 1, current === 1)}
      {items.map((item) =>
        typeof item === "number" ? (
          <button
            aria-current={item === current ? "page" : undefined}
            className="r1c-pagination__item"
            disabled={disabled}
            key={item}
            onClick={() => onPageChange?.(item)}
            type="button"
          >
            {item}
          </button>
        ) : (
          <span
            aria-hidden="true"
            className="r1c-pagination__ellipsis"
            key={item}
          >
            <Ellipsis size={18} />
          </span>
        ),
      )}
      {renderControl(
        "Next page",
        <ChevronRight size={18} />,
        current + 1,
        current === totalPages,
      )}
    </nav>
  );
}
