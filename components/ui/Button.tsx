type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "outline";
};

export default function Button({
  children,
  variant = "primary",
}: ButtonProps) {
  const base =
    "rounded-lg px-6 py-3 font-medium transition focus:outline-none";
  const styles =
    variant === "primary"
      ? "bg-primary text-white hover:bg-primary-dark"
      : "border border-border text-heading hover:bg-surface";

  return <button className={`${base} ${styles}`}>{children}</button>;
}
