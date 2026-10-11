import styles from './Header.module.css'

export function Header() {
    return (
    <header className={styles.header}>
      <p className={styles.h1}>Генератор заявлений</p>
      <a className={styles.report} href = 'https://t.me/sep_technologies?direct' target="_blank">Обратная связь</a>
    </header>
  )
}
