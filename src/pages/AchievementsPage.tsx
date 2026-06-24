import React from 'react';
import { Profile } from '../types';
import Logo from '../components/Logo';
import Footer from '../components/Footer';

const FONT = "'Heebo', 'Assistant', sans-serif";

interface AchievementsPageProps {
  profile: Profile;
  onBack: () => void;
}

export default function AchievementsPage({ profile, onBack }: AchievementsPageProps) {
  const achievements = Object.values(profile.achievements);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div dir="rtl" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', top: '-15%', right: '-10%', width: '50vw', height: '50vw', maxWidth: '440px', background: 'radial-gradient(circle, rgba(251,191,36,0.17) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '0', left: '0', width: '40vw', height: '40vw', maxWidth: '340px', background: 'radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ flex: 1, padding: '0 18px 10px', position: 'relative', zIndex: 10, maxWidth: '580px', margin: '0 auto', width: '100%' }}>
        <Logo />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', marginTop: '8px' }}>
          <button onClick={onBack} style={{ padding: '12px 18px', borderRadius: '12px', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', fontFamily: FONT, fontWeight: 700, fontSize: '15px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>← חזרה</button>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 900, background: 'linear-gradient(135deg, #fbbf24, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: FONT, margin: 0 }}>הישגים 🏆</h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: FONT, margin: '5px 0 0' }}>{unlockedCount}/{achievements.length} הושגו</p>
          </div>
          <div style={{ width: '80px' }} />
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              style={{ padding: '20px 16px', borderRadius: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: achievement.unlocked ? 'linear-gradient(135deg, rgba(251,191,36,0.14) 0%, rgba(245,158,11,0.07) 100%)' : 'rgba(255,255,255,0.04)', border: `1px solid ${achievement.unlocked ? 'rgba(251,191,36,0.38)' : 'rgba(255,255,255,0.08)'}`, backdropFilter: 'blur(12px)', boxShadow: achievement.unlocked ? '0 0 28px rgba(251,191,36,0.12)' : 'none', opacity: achievement.unlocked ? 1 : 0.5 }}
            >
              <div style={{ fontSize: '40px', marginBottom: '10px', filter: achievement.unlocked ? 'drop-shadow(0 0 12px rgba(251,191,36,0.65))' : 'grayscale(100%)' }}>{achievement.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '14px', marginBottom: '5px', color: achievement.unlocked ? '#fbbf24' : 'rgba(255,255,255,0.4)', fontFamily: FONT }}>{achievement.title}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.38)', fontFamily: FONT, lineHeight: 1.5 }}>{achievement.description}</div>
              {achievement.unlocked && achievement.unlockedAt && (
                <div style={{ fontSize: '11px', color: 'rgba(251,191,36,0.5)', fontFamily: FONT, marginTop: '8px' }}>{new Date(achievement.unlockedAt).toLocaleDateString('he-IL')}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
