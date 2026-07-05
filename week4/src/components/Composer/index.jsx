import { useEffect, useRef, useState } from "react"
import { ArrowUp } from "lucide-react"
import styles from "./styles.module.css"

export function Composer({ onSend }) {
  const [value, setValue] = useState("")
  const textareaRef = useRef(null)

  const resize = () => {
    const el = textareaRef.current
    el.style.height = "auto"
    el.style.height = el.scrollHeight + "px"
  }

  useEffect(() => resize(), [value])

  const submit = () => {
    if (!value.trim()) return
    onSend?.(value)
    setValue("")
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <form
      className={styles.composer}
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        placeholder="What's on your mind?"
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className={styles.button} type="submit" aria-label="Send">
        <ArrowUp size={16} />
      </button>
    </form>
  )
}
