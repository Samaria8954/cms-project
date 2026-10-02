import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Page",
  description: "Manage all website pages",
};

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}