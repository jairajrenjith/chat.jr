function Message({ msg, user }) {
  const isMe = msg.uid === user.uid;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: isMe ? "flex-end" : "flex-start",
      marginBottom: "16px",
    }}>
      <div style={{
        background: isMe ? "linear-gradient(135deg, #3b82f6, #2563eb)" : "#1e293b",
        padding: "12px 16px",
        borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        maxWidth: "80%",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
      }}>
        {!isMe && <div style={styles.senderName}>{msg.name}</div>}
        <div style={styles.text}>{msg.text}</div>
      </div>
      <div style={styles.timestamp}>
        {msg.createdAt?.toDate() ? new Date(msg.createdAt.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'}
      </div>
    </div>
  );
}

const styles = {
  senderName: { fontSize: "11px", fontWeight: "700", color: "#60a5fa", marginBottom: "4px", textTransform: "uppercase" },
  text: { fontSize: "14.5px", lineHeight: "1.5", color: "#fff" },
  timestamp: { fontSize: "10px", color: "#475569", marginTop: "4px", marginHorizontal: "4px" }
};

export default Message;