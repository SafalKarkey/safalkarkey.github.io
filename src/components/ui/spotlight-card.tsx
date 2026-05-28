import { useCallback, type ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  as?: React.ElementType;
  [key: string]: unknown;
}

export function SpotlightCard({
  children,
  as: Component = "div",
  className,
  ...props
}: SpotlightCardProps) {
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--x", `${x}%`);
      el.style.setProperty("--y", `${y}%`);
    },
    []
  );

  return (
    <Component
      data-glow
      className={className}
      onPointerMove={handlePointerMove}
      {...props}
    >
      {children}
    </Component>
  );
}
