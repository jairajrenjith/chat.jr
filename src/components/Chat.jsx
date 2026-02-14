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
    if (!inputRoom.trim()) return alert("Room name cannot be empty");

    const roomRef = doc(db, "rooms", inputRoom);
    const roomSnap = await getDoc(roomRef);

    if (roomSnap.exists()) {
      const data = roomSnap.data();
      if (data.type === "private") {
        const enteredPassword = prompt("Enter room password:");
        if (enteredPassword !== data.password) return alert("Incorrect room password");
      }
    } else {
      await setDoc(roomRef, { type: "public" });
    }
    setRoom(inputRoom);
  };

  if (room) return <ChatRoom room={room} user={user} goBack={() => setRoom(null)} />;

  return (
    <div style={styles.wrapper}>
      <div style={styles.panel}>
        <div style={styles.header}>
          <div style={styles.userInfo}>
            <div style={styles.welcome}>{user.displayName}</div>
          </div>
          <button onClick={handleLogout} style={styles.logout}>Sign Out</button>
        </div>

        <div style={styles.joinSection}>
          <input
            placeholder="Enter Room"
            value={inputRoom}
            onChange={(e) => setInputRoom(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && joinRoom()}
            style={styles.input}
          />
          <button onClick={joinRoom} style={styles.joinBtn}>Enter</button>
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
    padding: "20px"
  },
  panel: {
    width: "100%",
    maxWidth: "520px",
    background: "var(--panel)",
    padding: "30px",
    borderRadius: "18px"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "10px"
  },
  userInfo: {
    display: "flex",
    alignItems: "center"
  },
  welcome: {
    fontSize: "16px",
    fontWeight: "600"
  },
  joinSection: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },
  input: {
    flex: "1 1 250px",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid var(--muted)",
    background: "transparent",
    color: "var(--text)"
  },
  joinBtn: {
    padding: "12px 18px",
    background: "var(--accent)",
    border: "none",
    borderRadius: "10px",
    color: "white",
    flexShrink: 0
  },
  logout: {
    background: "transparent",
    border: "1px solid var(--muted)",
    padding: "8px 14px",
    borderRadius: "8px",
    color: "var(--muted)"
  }
};

export default Chat;
