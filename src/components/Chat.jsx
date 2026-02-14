import { useState } from "react";
import ChatRoom from "./ChatRoom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function Chat({ user }) {
  const [room, setRoom] = useState(null);
  const [inputRoom, setInputRoom] = useState("");

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  const joinRoom = async () => {
    if (!inputRoom.trim()) return;
    const roomRef = doc(db, "rooms", inputRoom);
    const roomSnap = await getDoc(roomRef);

    if (roomSnap.exists()) {
      const data = roomSnap.data();
      if (data.type === "private") {
        const pw = prompt("Enter password:");
        if (pw === data.password) setRoom(inputRoom);
        else alert("Wrong password");
      } else setRoom(inputRoom);
    } else {
      await setDoc(roomRef, { type: "public" });
      setRoom(inputRoom);
    }
  };

  if (room) return <ChatRoom room={room} user={user} goBack={() => setRoom(null)} />;

  return (
    <div style={styles.wrapper}>
      <div style={styles.panel}>
        <div style={styles.header}>
          <div style={styles.userInfo}>
            <img src={user.photoURL} alt="pfp" style={styles.avatar} />
            <div>
              <div style={styles.welcomeText}>Welcome back,</div>
              <div style={styles.userName}>{user.displayName}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>Sign Out</button>
        </div>

        <div style={styles.content}>
          <h2 style={styles.cta}>Join or Create a Room</h2>
          <div style={styles.inputGroup}>
            <input
              placeholder="Enter Room (e.g. general)"
              value={inputRoom}
              onChange={(e) => setInputRoom(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && joinRoom()}
              style={styles.input}
            />
            <button onClick={joinRoom} style={styles.joinBtn}>Enter</button>
          </div>
        </div>

        <div style={styles.footer}>
          © {new Date().getFullYear()} CHAT.JR • ALL RIGHTS RESERVED
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" },
  panel: {
    width: "100%",
    maxWidth: "540px",
    background: "rgba(15, 23, 42, 0.6)",
    backdropFilter: "blur(24px)",
    borderRadius: "32px",
    padding: "48px",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 40px 80px -20px rgba(0, 0, 0, 0.5)",
    textAlign: "center"
  },
  header: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: "64px",
    paddingBottom: "24px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
  },
  userInfo: { display: "flex", alignItems: "center", gap: "16px" },
  avatar: { width: "48px", height: "48px", borderRadius: "14px", border: "2px solid #3b82f6" },
  welcomeText: { fontSize: "13px", color: "#64748b", textAlign: "left" },
  userName: { fontSize: "18px", fontWeight: "700", color: "#f8fafc", textAlign: "left" },
  logoutBtn: { background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#94a3b8", padding: "10px 18px", borderRadius: "12px", fontSize: "13px" },
  content: { textAlign: "left", marginBottom: "60px" },
  cta: { fontSize: "24px", marginBottom: "28px", fontWeight: "700", letterSpacing: "-0.5px" },
  inputGroup: { display: "flex", gap: "12px" },
  input: { flex: 1, padding: "18px 20px", borderRadius: "16px", background: "#020617", border: "1px solid #1e293b", color: "white", fontSize: "15px" },
  joinBtn: { background: "#3b82f6", color: "white", border: "none", padding: "0 32px", borderRadius: "16px", fontWeight: "600", fontSize: "15px" },
  footer: {
    fontSize: "10px",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "2.5px",
    fontWeight: "600",
    opacity: 0.6,
    marginTop: "20px"
  }
};

export default Chat;
