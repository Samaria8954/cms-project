type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Container({
  children,
  className = "",
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-5 sm:px-4 lg:px-6 2xl:px-8 ${className}`}
    >
      {children}
    </div>
  );
}