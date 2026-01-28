import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

function Login() {
  const signIn = async () => {
    await signInWithPopup(auth, provider);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.logoText}>
          chat<span style={styles.logoDot}>.</span>jr
        </h1>
        <p style={styles.subtitle}>Secure, real-time rooms for modern teams.</p>

        <button onClick={signIn} style={styles.button}>
          <img 
            src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" 
            alt="G" 
            style={styles.googleIcon} 
          />
          <span style={styles.buttonText}>Continue with Google</span>
        </button>
        
        <div style={styles.footer}>
          © {new Date().getFullYear()} chat.jr • ALL RIGHTS RESERVED
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    height: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px"
  },
  card: {
    background: "rgba(15, 23, 42, 0.8)",
    backdropFilter: "blur(12px)",
    padding: "clamp(40px, 8vw, 60px) clamp(20px, 5vw, 40px)",
    borderRadius: "28px",
    textAlign: "center",
    width: "100%",
    maxWidth: "420px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
  },
  logoText: {
    fontSize: "clamp(36px, 10vw, 48px)",
    fontWeight: "700",
    marginBottom: "8px",
    letterSpacing: "-2px",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    color: "#fff",
    textShadow: "0 0 20px rgba(59, 130, 246, 0.3)"
  },
  logoDot: {
    color: "#3b82f6"
  },
  subtitle: {
    fontSize: "14px",
    color: "#94a3b8",
    marginBottom: "48px",
    lineHeight: "1.5",
    fontWeight: "400"
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 24px",
    background: "#ffffff",
    border: "none",
    color: "#0f172a",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: "600",
    width: "100%",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease"
  },
  googleIcon: {
    width: "20px",
    height: "20px",
    marginRight: "12px"
  },
  buttonText: {
    whiteSpace: "nowrap"
  },
  footer: {
    marginTop: "40px",
    fontSize: "11px",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "2px",
    fontWeight: "600"
  }
};

export default Login;