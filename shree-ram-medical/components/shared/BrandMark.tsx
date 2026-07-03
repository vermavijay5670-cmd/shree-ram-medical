import styles from "./BrandMark.module.css";

export function BrandMark({ size = 30 }: { size?: number }) {
  return (
    <div
      className={styles.mark}
      style={{ width: size, height: size, borderRadius: size * 0.3 }}
      aria-hidden
    />
  );
}
