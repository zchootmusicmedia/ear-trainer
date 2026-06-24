import React, { useEffect, useState } from 'react';
import { Achievement } from '../types';

const FONT = "'Heebo', 'Assistant', sans-serif";

interface AchievementToastProps {
  achievement: Achievement | null;
  onDismiss: () => void;
}

export default function AchievementToast({ achievement, onDismiss }: AchievementToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 400);
      }, 3200);
      return () => clearTimeout(timer);
    }
  }, [achievement]);

  if (!achievement) return null;

  return (
    <div
      dir="rtl"
      style={{
        position: 'fixed',
        top: '24px',
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? '0' : '-120px'})`,
        transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease',
        opacity: visible ? 1 : 0,
        zIndex: 9999,
        maxWidth: '360px',
        width: 'calc(100vw - 48px)',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '18px 22px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(251,191,36,0.18) 0%, rgba(251,146,60,0.12) 100%)',
        border: '1px solid rgba(251,191,36,0.45)',
        backdropFilter: 'blur(30px)',
        boxShadow: '0 0 50px rgba(251,191,36,0.25), 0 20px 50px rgba(0,0,0,0.6)',
      }}>
        <div style={{
          fontSize: '42px',
          flexShrink: 0,
          filter: 'drop-shadow(0 0 16px rgba(251,191,36,0.8))',
          animation: 'bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          {achievement.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '11px', color: 'rgba(251,191,36,0.7)', fontFamily: FONT, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '3px' }}>
            הישג חדש! 🎉
          </div>
          <div style={{ fontSize: '17px', fontWeight: 900, color: '#fbbf24', fontFamily: FONT }}>
            {achievement.title}
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', fontFamily: FONT, marginTop: '3px' }}>
            {achievement.description}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes bounceIn {
          0%  { transform: scale(0.3) rotate(-10deg); opacity: 0; }
          60% { transform: scale(1.15) rotate(5deg); }
          80% { transform: scale(0.95) rotate(-3deg); }
          100%{ transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
