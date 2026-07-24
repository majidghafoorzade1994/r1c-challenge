import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils";
import "./section.css";

export type SectionProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  description?: string;
  title: string;
};

export function Section({
  children,
  className,
  description,
  title,
  ...props
}: SectionProps) {
  return (
    <section className={cx("r1c-section", className)} {...props}>
      <header className="r1c-section__header">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </header>
      {children && <div className="r1c-section__content">{children}</div>}
    </section>
  );
}
