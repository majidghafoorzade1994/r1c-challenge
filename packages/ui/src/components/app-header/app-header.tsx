"use client";

import type { HTMLAttributes } from "react";
import { Button } from "../button";
import { cx } from "../../utils";
import "./app-header.css";

export type AppHeaderProps = HTMLAttributes<HTMLElement> & {
  brand?: string;
  onLogout?: () => void;
  user: string;
};

export function AppHeader({
  brand = "Arvancloud Challenge",
  className,
  onLogout,
  user,
  ...props
}: AppHeaderProps) {
  return (
    <header className={cx("r1c-header", className)} {...props}>
      <p>
        Welcome <strong>{user}</strong>
      </p>
      <strong className="r1c-header__brand">{brand}</strong>
      <Button onClick={onLogout} variant="secondary">
        Log out
      </Button>
    </header>
  );
}
