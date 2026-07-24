import type { Metadata } from "next";
import { AdminPortal } from "./AdminPortal";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * Internal admin portal (Supabase Auth email/password). Server shell carries
 * noindex metadata; all interactivity lives in the AdminPortal client
 * component. Data access is enforced by RLS (migration 0006): only the
 * authenticated admin email can SELECT the form tables.
 */
export default function AdminPage() {
  return <AdminPortal />;
}
