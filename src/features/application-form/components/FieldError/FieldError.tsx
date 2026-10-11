import type {FieldErrorProps} from "../../types/FieldErrorProps.ts";
import styles from './FieldError.module.css';

export function FieldError({id, message}: FieldErrorProps) {
    if (!message) return null;
    return (<p id={id} className={styles.error}>{message}</p>);
}
