import Link from "next/link";
import { cn } from "@/lib/utils";
import styles from "./Button.module.css";

type Variant = "primary" | "ghost" | "subtle";

interface CommonProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

interface LinkButtonProps
  extends CommonProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> {
  href: string;
}

interface RealButtonProps
  extends CommonProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {
  href?: undefined;
}

export function Button(props: LinkButtonProps | RealButtonProps) {
  const { variant = "primary", className, children, ...rest } = props;
  const classes = cn(styles.btn, styles[variant], className);

  if ("href" in props && props.href) {
    const { href, ...anchorRest } = rest as Omit<LinkButtonProps, keyof CommonProps>;
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  const buttonRest = rest as Omit<RealButtonProps, keyof CommonProps>;
  return (
    <button className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
