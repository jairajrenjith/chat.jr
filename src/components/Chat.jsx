import { useState } from "react";
import ChatRoom from "./ChatRoom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function Chat({ user, theme, setTheme }) {
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
        const enteredPassword = prompt("Enter room password:");
        if (enteredPassword !== data.password) return;
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
            <div style={styles.avatar}>
              {user.displayName?.charAt(0)}
            </div>
            <div>
              <div style={styles.welcome}>{user.displayName}</div>
            </div>
          </div>

          <div style={styles.actions}>
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={styles.mutedBtn}>
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <button onClick={handleLogout} style={styles.mutedBtn}>
              Sign Out
            </button>
          </div>
        </div>

        <div style={styles.joinSection}>
          <input
            placeholder="Enter room"
            value={inputRoom}
            onChange={(e) => setInputRoom(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && joinRoom()}
            style={styles.input}
          />
          <button onClick={joinRoom} style={styles.joinBtn}>
            Enter
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
    padding: "20px"
  },
  panel: {
    width: "520px",
    maxWidth: "100%",
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
    gap: "15px"
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "var(--accent)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "600",
    color: "white"
  },
  welcome: {
    fontWeight: "600",
    fontSize: "15px"
  },
  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },
  joinSection: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },
  input: {
    flex: 1,
    minWidth: "200px",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid var(--muted)",
    background: "transparent",
    color: "var(--text)"
  },
  joinBtn: {
    padding: "12px 18px",
    borderRadius: "10px",
    border: "none",
    background: "var(--accent)",
    color: "white"
  },
  mutedBtn: {
    padding: "8px 14px",
    borderRadius: "8px",
    background: "transparent",
    border: "1px solid var(--muted)",
    color: "var(--muted)"
  }
};

export default Chat;
