import { redirect } from "next/navigation";

export default function StorefrontRegisterPage() {
  redirect("/login?register=true");
}
