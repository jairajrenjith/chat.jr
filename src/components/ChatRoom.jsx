import { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import Message from "./Message";

function ChatRoom({ room, user, goBack }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const bottomRef = useRef();

  useEffect(() => {
    const q = query(collection(db, "rooms", room, "messages"), orderBy("createdAt"));
    const unsub = onSnapshot(q, (snap) => setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, [room]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    await addDoc(collection(db, "rooms", room, "messages"), {
      text: newMsg, name: user.displayName, uid: user.uid, createdAt: serverTimestamp(),
    });
    setNewMsg("");
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={goBack} style={styles.backBtn}>←</button>
        <div style={styles.roomInfo}>
          <div style={styles.statusDot} />
          <h3 style={styles.roomName}>{room}</h3>
        </div>
      </header>

      <div style={styles.chatArea}>
        {messages.map((m) => <Message key={m.id} msg={m} user={user} />)}
        <div ref={bottomRef} />
      </div>

      <footer style={styles.footerContainer}>
        <div style={styles.inputWrapper}>
          <input
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={`Message #${room}`}
            style={styles.input}
          />
          <button onClick={sendMessage} style={styles.sendBtn}>Send</button>
        </div>
        <div style={styles.copyright}>
          © {new Date().getFullYear()} CHAT.JR • ALL RIGHTS RESERVED
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: { height: "100vh", display: "flex", flexDirection: "column", maxWidth: "900px", margin: "0 auto" },
  header: { padding: "20px", display: "flex", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(10px)" },
  backBtn: { background: "none", border: "none", color: "#94a3b8", fontSize: "24px", marginRight: "20px", cursor: "pointer" },
  roomInfo: { display: "flex", alignItems: "center", gap: "10px" },
  statusDot: { width: "8px", height: "8px", background: "#10b981", borderRadius: "50%" },
  roomName: { margin: 0, fontSize: "18px", fontWeight: "600", color: "#fff" },
  chatArea: { flex: 1, overflowY: "auto", padding: "24px" },
  footerContainer: { padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" },
  inputWrapper: { width: "100%", display: "flex", background: "#0f172a", padding: "6px", borderRadius: "18px", border: "1px solid #1e293b" },
  input: { flex: 1, background: "transparent", border: "none", color: "white", padding: "12px 18px", fontSize: "15px" },
  sendBtn: { background: "#3b82f6", color: "white", border: "none", padding: "10px 20px", borderRadius: "14px", fontWeight: "600", cursor: "pointer" },
  copyright: {
    fontSize: "9px",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "2px",
    fontWeight: "600",
    opacity: 0.5
  }
};

export default ChatRoom;