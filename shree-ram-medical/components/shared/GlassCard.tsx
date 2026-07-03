import { cn } from "@/lib/utils";
import styles from "./GlassCard.module.css";

export function GlassCard({
  className,
  children,
  as: Component = "div",
  style,
}: {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "li";
  style?: React.CSSProperties;
}) {
  return (
    <Component className={cn(styles.card, className)} style={style}>
      {children}
    </Component>
  );
}
