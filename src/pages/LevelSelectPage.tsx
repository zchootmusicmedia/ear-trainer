import React from 'react';
import { Profile } from '../types';
import { LEVELS, LEVEL_NOTE_LABELS } from '../data/levels';
import { getDailyChallenge } from '../data/storage';
import ProgressBar from '../components/ProgressBar';
import Logo from '../components/Logo';
import Footer from '../components/Footer';

const FONT = "'Heebo', 'Assistant', sans-serif";

interface LevelSelectPageProps {
  profile: Profile;
  onSelectLevel: (levelId: number) => void;
  onSongLevel: () => void;
  onDailyChallenge: () => void;
  onBack: () => void;
  onAchievements: () => void;
}

export default function LevelSelectPage({ profile, onSelectLevel, onSongLevel, onDailyChallenge, onBack, onAchievements }: LevelSelectPageProps) {
  const today = new Date().toISOString().split('T')[0];
  const dailyDone = profile.dailyChallenges[today]?.completed;

  const allCompleted = LEVELS.every((level) => {
    const prog = profile.levelProgress[level.id];
    return Object.values(prog?.exercises || {}).filter((e) => e.completed).length === 10;
  });

  return (
    <div dir="rtl" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', top: '-15%', left: '-10%', width: '55vw', height: '55vw', maxWidth: '500px', background: 'radial-gradient(circle, rgba(251,146,60,0.15) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', maxWidth: '500px', background: 'radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ flex: 1, padding: '0 18px 10px', position: 'relative', zIndex: 10, maxWidth: '580px', margin: '0 auto', width: '100%' }}>
        <Logo />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', marginTop: '8px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onAchievements} style={{ padding: '10px 14px', borderRadius: '12px', background: 'rgba(251,191,36,0.13)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.28)', fontFamily: FONT, fontSize: '17px', cursor: 'pointer' }}>🏆</button>
            <button onClick={onBack} style={{ padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', fontFamily: FONT, fontSize: '14px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.11)', cursor: 'pointer' }}>← פרופיל</button>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 800, color: '#fff', fontSize: '16px', fontFamily: FONT }}>{profile.avatar} {profile.name}</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontFamily: FONT, marginTop: '2px' }}>⭐ {profile.totalStars} · 🔥 {profile.streak}</div>
          </div>
          <div style={{ width: '80px' }} />
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <h2 style={{ fontSize: '30px', fontWeight: 900, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #fb923c 0%, #fbbf24 50%, #c4b5fd 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: FONT, margin: 0 }}>לנגן משמיעה</h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', fontFamily: FONT, marginTop: '5px' }}>בחר רמה להתחיל</p>
        </div>

        {/* Completion medal */}
        {allCompleted && (
          <div style={{ marginBottom: '16px', padding: '20px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(251,191,36,0.18) 0%, rgba(251,146,60,0.12) 50%, rgba(167,139,250,0.1) 100%)', border: '1px solid rgba(251,191,36,0.45)', boxShadow: '0 0 50px rgba(251,191,36,0.2)', textAlign: 'center' }}>
            <div style={{ fontSize: '50px', marginBottom: '10px', filter: 'drop-shadow(0 0 20px #fbbf24)' }}>🏅</div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#fbbf24', fontFamily: FONT, marginBottom: '6px' }}>כל הכבוד! השגת את הכל!</div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'rgba(255,255,255,0.8)', fontFamily: FONT, lineHeight: 1.6 }}>זהו! את/ה מוכנ/ה לנגן שירים מתוך שמיעה!!</div>
          </div>
        )}

        {/* Daily challenge */}
        <button
          onClick={onDailyChallenge}
          style={{ width: '100%', marginBottom: '12px', padding: '16px 18px', borderRadius: '17px', display: 'flex', alignItems: 'center', gap: '14px', background: dailyDone ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg, rgba(251,191,36,0.14) 0%, rgba(245,158,11,0.07) 100%)', border: `1px solid ${dailyDone ? 'rgba(255,255,255,0.08)' : 'rgba(251,191,36,0.42)'}`, backdropFilter: 'blur(20px)', boxShadow: dailyDone ? 'none' : '0 0 28px rgba(251,191,36,0.12)', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'right' }}
          onMouseEnter={e => { if (!dailyDone) { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 45px rgba(251,191,36,0.2)'; (e.currentTarget as HTMLElement).style.border = '1px solid rgba(251,191,36,0.6)'; } }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = dailyDone ? 'none' : '0 0 28px rgba(251,191,36,0.12)'; (e.currentTarget as HTMLElement).style.border = `1px solid ${dailyDone ? 'rgba(255,255,255,0.08)' : 'rgba(251,191,36,0.42)'}`; }}
        >
          <span style={{ fontSize: '30px', filter: dailyDone ? 'grayscale(60%)' : 'drop-shadow(0 0 12px #fbbf24)' }}>{dailyDone ? '✅' : '☀️'}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '16px', color: dailyDone ? 'rgba(255,255,255,0.38)' : '#fbbf24', fontFamily: FONT }}>אתגר יומי</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.38)', fontFamily: FONT, marginTop: '2px' }}>
              {dailyDone ? `הושלם · ${profile.dailyChallenges[today]?.stars} ⭐` : 'מדליה מיוחדת מחכה לך'}
            </div>
          </div>
        </button>

        {/* Level list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {LEVELS.map((level) => {
            const levelProg = profile.levelProgress[level.id];
            const completedExercises = Object.values(levelProg?.exercises || {}).filter((e) => e.completed).length;
            const totalStarsEarned = Object.values(levelProg?.exercises || {}).reduce((sum, e) => sum + (e.stars || 0), 0);
            const isComplete = completedExercises === 10;

            return (
              <button
                key={level.id}
                onClick={() => onSelectLevel(level.id)}
                style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', background: isComplete ? 'rgba(52,211,153,0.07)' : 'rgba(255,255,255,0.06)', border: `1px solid ${isComplete ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.1)'}`, backdropFilter: 'blur(16px)', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'right' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(251,146,60,0.1)'; (e.currentTarget as HTMLElement).style.border = '1px solid rgba(251,146,60,0.32)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(251,146,60,0.1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isComplete ? 'rgba(52,211,153,0.07)' : 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.border = `1px solid ${isComplete ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.1)'}`; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 900, fontSize: '15px', background: isComplete ? 'linear-gradient(135deg, #34d399, #10b981)' : 'rgba(255,255,255,0.1)', color: isComplete ? '#001a0e' : 'rgba(255,255,255,0.65)', boxShadow: isComplete ? '0 0 14px rgba(52,211,153,0.35)' : 'none' }}>
                    {isComplete ? '✓' : level.id}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: '#fff', fontSize: '15px', fontFamily: FONT }}>{level.name}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.42)', fontFamily: FONT, marginTop: '2px' }}>{LEVEL_NOTE_LABELS[level.id]}</div>
                  </div>
                  <div style={{ textAlign: 'left', flexShrink: 0 }}>
                    <div style={{ fontSize: '13px', color: '#fbbf24', fontFamily: FONT, fontWeight: 700 }}>⭐ {totalStarsEarned}/30</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.33)', fontFamily: FONT, marginTop: '2px' }}>{completedExercises}/10</div>
                  </div>
                </div>
                <ProgressBar value={completedExercises} max={10} color={isComplete ? '#34d399' : '#fb923c'} />
              </button>
            );
          })}

          {/* Songs final level card */}
          <button
            onClick={onSongLevel}
            style={{ width: '100%', marginTop: '6px', padding: '18px 18px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(167,139,250,0.14) 0%, rgba(139,92,246,0.08) 100%)', border: '1px solid rgba(167,139,250,0.38)', backdropFilter: 'blur(16px)', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'right', boxShadow: '0 0 36px rgba(167,139,250,0.12)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(167,139,250,0.22) 0%, rgba(139,92,246,0.14) 100%)'; (e.currentTarget as HTMLElement).style.border = '1px solid rgba(167,139,250,0.55)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 50px rgba(167,139,250,0.22)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(167,139,250,0.14) 0%, rgba(139,92,246,0.08) 100%)'; (e.currentTarget as HTMLElement).style.border = '1px solid rgba(167,139,250,0.38)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 36px rgba(167,139,250,0.12)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', fontSize: '22px', boxShadow: '0 0 20px rgba(167,139,250,0.45)', flexShrink: 0 }}>🎵</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 900, fontSize: '17px', color: '#c4b5fd', fontFamily: FONT }}>ועכשיו — לשירים!</div>
                <div style={{ fontSize: '13px', color: 'rgba(196,181,253,0.6)', fontFamily: FONT, marginTop: '3px' }}>מזהים פתיחות ומנגנים משמיעה</div>
              </div>
              <div style={{ fontSize: '18px', color: 'rgba(196,181,253,0.6)' }}>←</div>
            </div>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
