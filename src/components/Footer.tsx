import React from 'react';

export default function Footer() {
  return (
    <footer
      style={{
        width: '100%',
        padding: '14px 20px 16px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 20,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          height: '1px',
          marginBottom: '14px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(251,146,60,0.18) 30%, rgba(34,211,238,0.14) 70%, transparent 100%)',
          boxShadow: '0 0 8px rgba(251,146,60,0.08)',
        }}
      />
      <p
        style={{
          fontSize: '12px',
          color: 'rgba(255,255,255,0.25)',
          fontFamily: "'Heebo', 'Assistant', sans-serif",
          letterSpacing: '0.01em',
          lineHeight: 1.5,
        }}
      >
        {`© כל הזכויות שמורות – זכות. בי"ס דיגיטלי לנגינה`}
      </p>
    </footer>
  );
}
