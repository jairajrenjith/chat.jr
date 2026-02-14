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

  if (room) {
    return <ChatRoom room={room} user={user} goBack={() => setRoom(null)} />;
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.panel}>
        <div style={styles.header}>
          <div style={styles.welcome}>Welcome back, {user.displayName}</div>
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
    padding: "30px",
    borderRadius: "18px"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    gap: "10px",
    flexWrap: "wrap"
  },
  welcome: {
    fontSize: "16px",
    fontWeight: "600",
    wordBreak: "break-word"
  },
  joinSection: {
    display: "flex",
    gap: "10px",
    width: "100%"
  },
  input: {
    flex: 1,
    minWidth: 0,
    padding: "12px",
    borderRadius: "10px"
  },
  joinBtn: {
    padding: "12px 18px",
    borderRadius: "10px",
    flexShrink: 0
  },
  logout: {
    padding: "8px 14px",
    borderRadius: "8px",
    flexShrink: 0
  }
};

export default Chat;
