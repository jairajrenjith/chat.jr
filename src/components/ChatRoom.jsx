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
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        <div style={{
          padding: "15px 20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "inherit"
        }}>
          <button onClick={goBack} style={{ background: "transparent", border: "none", fontSize: "18px", color: "inherit" }}>
            ←
          </button>
          <div style={{ fontWeight: "600", fontSize: "14px", wordBreak: "break-word" }}>
            {room}
          </div>
        </div>

        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          WebkitOverflowScrolling: "touch"
        }}>
          {messages.map((msg) => (
            <Message key={msg.id} msg={msg} user={user} />
          ))}
          <div ref={bottomRef} />
        </div>

        <div style={{
          padding: "15px",
          display: "flex",
          gap: "10px"
        }}>
          <input
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Write a message..."
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "transparent",
              color: "inherit",
              minWidth: 0
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "12px 18px",
              borderRadius: "10px",
              border: "none"
            }}
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}

export default ChatRoom;
