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
  const bottomRef = useRef();

  useEffect(() => {
    const q = query(
      collection(db, "rooms", room, "messages"),
      orderBy("createdAt")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })));
    });

    return () => unsub();
  }, [room]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;

    try {
      await addDoc(collection(db, "rooms", room, "messages"), {
        text: newMsg,
        name: user.displayName,
        uid: user.uid,
        createdAt: serverTimestamp(),
      });
      setNewMsg("");
    } catch {
      alert("Message failed to send");
    }
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
            placeholder="Message"
            style={styles.input}
          />
          <button onClick={sendMessage} style={styles.send}>Send</button>
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
    padding: "10px"
  },
  chatShell: {
    width: "100%",
    maxWidth: "720px",
    height: "90vh",
    background: "var(--panel)",
    borderRadius: "18px",
    display: "flex",
    flexDirection: "column"
  },
  topBar: {
    padding: "16px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "500"
  },
  roomTitle: {
    fontSize: "15px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  messages: {
    flex: 1,
    padding: "16px",
    overflowY: "auto"
  },
  inputBar: {
    padding: "12px",
    display: "flex",
    gap: "10px",
    flexWrap: "nowrap"
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
    padding: "12px 16px",
    background: "var(--accent)",
    border: "none",
    borderRadius: "10px",
    color: "white",
    flexShrink: 0
  },
  back: {
    background: "transparent",
    border: "none",
    color: "var(--text)",
    fontSize: "18px"
  }
};

export default ChatRoom;
