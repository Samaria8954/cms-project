import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Pages",
  description: "Manage all website pages",
};

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}