import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils";
import "./sidebar.css";

export type SidebarProps = HTMLAttributes<HTMLElement>;

export function Sidebar({ className, ...props }: SidebarProps) {
  return (
    <aside className={cx("r1c-sidebar", className)} {...props}>
      <nav>{props.children}</nav>
    </aside>
  );
}

export type SidebarItemProps = ComponentProps<"a"> & {
  active?: boolean;
  icon?: ReactNode;
};

export function SidebarItem({
  active = false,
  children,
  className,
  icon,
  ...props
}: SidebarItemProps) {
  return (
    <a
      aria-current={active ? "page" : undefined}
      className={cx("r1c-sidebar__item", active && "is-active", className)}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </a>
  );
}
