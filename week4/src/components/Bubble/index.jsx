import styles from "./styles.module.css"

export function Bubble({ type = "agent", children }) {
  return <div className={`${styles.bubble} ${styles[type]}`}>{children}</div>
}
