import styles from "./PageHead.module.css";

export function PageHead({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <div className={styles.head}>
      <span className={styles.kicker}>{kicker}</span>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
