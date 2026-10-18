import styles from './PrivacyNotice.module.css';

export function PrivacyNotice() {
  return (
    <p className={styles.privacyParagraph}>
      Ваши персональные данные не отправляются нам и нигде не хранятся.
      <a href="https://github.com/SEP-Technologies-Inc/nsu-dorm-form">Убедитесь сами</a>
    </p>
  );
}
