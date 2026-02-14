import { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import Message from "./Message";

function ChatRoom({ room, user, goBack }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    const q = query(
      collection(db, "rooms", room, "messages"),
      orderBy("createdAt")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsub();
  }, [room]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;

    await addDoc(collection(db, "rooms", room, "messages"), {
      text: newMsg,
      name: user.displayName,
      uid: user.uid,
      createdAt: serverTimestamp(),
    });

    setNewMsg("");
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.chatShell}>
        <div style={styles.topBar}>
          <button onClick={goBack} style={styles.back}>←</button>
          <div style={styles.roomTitle}>{room}</div>
        </div>

        <div style={styles.messages}>
          {messages.map((msg) => (
            <Message key={msg.id} msg={msg} user={user} />
          ))}
          <div ref={bottomRef} />
        </div>

        <div style={styles.inputBar}>
          <input
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Write a message"
            style={styles.input}
          />
          <button onClick={sendMessage} style={styles.send}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "15px"
  },
  chatShell: {
    width: "720px",
    maxWidth: "100%",
    height: "85vh",
    display: "flex",
    flexDirection: "column",
    background: "var(--panel)",
    borderRadius: "18px",
    overflow: "hidden"
  },
  topBar: {
    padding: "15px 20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderBottom: "1px solid rgba(255,255,255,0.08)"
  },
  roomTitle: {
    fontWeight: "600",
    fontSize: "14px",
    wordBreak: "break-word"
  },
  messages: {
    flex: 1,
    padding: "20px",
    overflowY: "auto"
  },
  inputBar: {
    padding: "15px",
    display: "flex",
    gap: "10px"
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid var(--muted)",
    background: "transparent",
    color: "var(--text)"
  },
  send: {
    padding: "12px 18px",
    borderRadius: "10px",
    border: "none",
    background: "var(--accent)",
    color: "white"
  },
  back: {
    background: "transparent",
    border: "none",
    color: "var(--text)",
    fontSize: "18px"
  }
};

export default ChatRoom;
