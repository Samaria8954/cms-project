import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add New Menu",
};

export default function NewMenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}