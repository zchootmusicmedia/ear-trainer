import { DEMO_PAYMENT_URL } from "../data/demoConfig";

export default function DemoUpgradeModal({ onClose }: { onClose: () => void }) {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.55)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      direction: "rtl",
      padding: 20
    }}>
      <div style={{
        maxWidth: 520,
        width: "100%",
        background: "linear-gradient(145deg, #4b2e5a, #6f4a80)",
        color: "white",
        borderRadius: 28,
        padding: 32,
        textAlign: "center"
      }}>
        <h2>היה כיף, נכון?</h2>

        <p style={{ fontSize: 18, lineHeight: 1.7 }}>
          רוצים להמשיך ללמוד?
          <br /><br />
          מחכים לכם עוד עשרות תרגילים, שלבים מתקדמים,
          פיתוח שמיעה, זיהוי שירים ונגינה משמיעה!
          <br /><br />
          מוזמנים להתקדם עד לרמת נגינה מלאה.
          <br />
          לחצו כאן &gt;&gt;
        </p>

        <a
          href={DEMO_PAYMENT_URL}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "block",
            background: "#f4c95d",
            color: "#32183d",
            padding: "16px 22px",
            borderRadius: 18,
            fontWeight: 900,
            fontSize: 18,
            textDecoration: "none",
            marginBottom: 14
          }}
        >
          אני רוצה להמשיך ללמוד
        </a>

        <button onClick={onClose}>
          אולי אחר כך
        </button>
      </div>
    </div>
  );
}