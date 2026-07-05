import { useEffect, useRef, useState } from "react";
import "./styles.css";
import { Composer } from "./components/Composer";
import { Bubble } from "./components/Bubble";
import { sendMessage } from "./emoji-api";

let nextId = 3;

export default function App() {
  const [messages, setMessages] = useState([
    { id: 1, type: "user", text: "hello" },
    { id: 2, type: "agent", text: "👋" },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    setMessages((prev) => [...prev, { id: nextId++, type: "user", text }]);

    setIsTyping(true);
    const reply = await sendMessage(text);
    setIsTyping(false);

    setMessages((prev) => [
      ...prev,
      { id: nextId++, type: "agent", text: reply },
    ]);
  };

  return (
    <div className="app">
      <div className="messages">
        {messages.map((message) => (
          <Bubble key={message.id} type={message.type}>
            {message.text}
          </Bubble>
        ))}
        {isTyping && <Bubble type="agent">typing…</Bubble>}
        <div ref={endRef} />
      </div>
      <Composer onSend={handleSend} />
    </div>
  );
}
