import type { Metadata } from "next";
import { AuthForm } from "../_components/auth-form";

export const metadata: Metadata = {
  title: "Sign up | Blog Admin Panel",
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
