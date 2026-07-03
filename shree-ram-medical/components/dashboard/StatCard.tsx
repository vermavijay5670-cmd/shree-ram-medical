import styles from "./StatCard.module.css";

export function StatCard({
  icon,
  iconBg,
  delta,
  direction,
  value,
  label,
}: {
  icon: React.ReactNode;
  iconBg: string;
  delta: string;
  direction: "up" | "down";
  value: string;
  label: string;
}) {
  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <div className={styles.icon} style={{ background: iconBg }}>
          {icon}
        </div>
        <span className={`${styles.delta} ${direction === "up" ? styles.up : styles.down}`}>{delta}</span>
      </div>
      <div className={styles.val}>{value}</div>
      <div className={styles.lbl}>{label}</div>
    </div>
  );
}
