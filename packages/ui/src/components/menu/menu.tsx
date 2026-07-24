import type { ComponentProps, HTMLAttributes } from "react";
import { Spinner } from "../spinner";
import { cx } from "../../utils";
import "./menu.css";

export type MenuProps = HTMLAttributes<HTMLDivElement>;

export function Menu({ className, ...props }: MenuProps) {
  return <div className={cx("r1c-menu", className)} role="menu" {...props} />;
}

export type MenuItemProps = ComponentProps<"button"> & {
  active?: boolean;
};

export function MenuItem({
  active = false,
  className,
  type = "button",
  ...props
}: MenuItemProps) {
  return (
    <button
      className={cx("r1c-menu__item", active && "is-active", className)}
      role="menuitem"
      type={type}
      {...props}
    />
  );
}

export type MenuLoadingProps = HTMLAttributes<HTMLDivElement>;

export function MenuLoading({
  children = "loading...",
  className,
  ...props
}: MenuLoadingProps) {
  return (
    <div className={cx("r1c-menu__loading", className)} {...props}>
      <Spinner />
      <span>{children}</span>
    </div>
  );
}
