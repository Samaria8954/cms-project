import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menus",
};

export default function MenusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}