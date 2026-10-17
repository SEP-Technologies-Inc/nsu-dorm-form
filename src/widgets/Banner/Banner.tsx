import styles from './Banner.module.css';

export function Banner() {
  return (
    <aside aria-label="Информационное сообщение">
      <a className={styles.banner} href="https://petitions.sepcode.eu/api/share/50">
        <p className={styles.header}>Поддержите отмену поправок в положение</p>
        <span className={styles.button}>Оставьте подпись</span>
      </a>
    </aside>
  );
}
