import { redirect } from "next/navigation"

export default function Home() {
  // Entry point: go to admin. Middleware will redirect to /admin/login if not authenticated.
  redirect("/admin")
}
