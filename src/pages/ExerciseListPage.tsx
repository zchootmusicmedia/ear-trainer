import React, { useState } from 'react';
import { Profile } from '../types';
import { LEVELS, LEVEL_NOTE_LABELS } from '../data/levels';
import StarRating from '../components/StarRating';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import DemoUpgradeModal from '../components/DemoUpgradeModal';
import { isDemoExerciseOpen } from '../data/demoConfig';

const FONT = "'Heebo', 'Assistant', sans-serif";

interface ExerciseListPageProps {
  profile: Profile;
  levelId: number;
  currentExerciseIndex: number;
  onSelectExercise: (index: number) => void;
  onBack: () => void;
}

export default function ExerciseListPage({ profile, levelId, currentExerciseIndex, onSelectExercise, onBack }: ExerciseListPageProps) {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const level = LEVELS.find((l) => l.id === levelId)!;
  const levelProg = profile.levelProgress[levelId];
  const completedCount = Object.values(levelProg?.exercises || {}).filter((e) => e.completed).length;
  const progressPct = Math.round((completedCount / level.exercises.length) * 100);

  return (
    <div dir="rtl" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', top: '-10%', right: '-10%', width: '50vw', height: '50vw', maxWidth: '440px', background: 'radial-gradient(circle, rgba(251,146,60,0.14) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '0', left: '0', width: '40vw', height: '40vw', maxWidth: '360px', background: 'radial-gradient(circle, rgba(167,139,250,0.14) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ flex: 1, padding: '0 18px 10px', position: 'relative', zIndex: 10, maxWidth: '580px', margin: '0 auto', width: '100%' }}>
        <Logo />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', marginTop: '8px' }}>
          <button onClick={onBack} style={{ padding: '12px 18px', borderRadius: '12px', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', fontFamily: FONT, fontWeight: 700, fontSize: '15px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.2s' }}>
            ← חזרה
          </button>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 900, color: '#fff', fontSize: '20px', fontFamily: FONT }}>{level.name}</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontFamily: FONT, marginTop: '3px' }}>{LEVEL_NOTE_LABELS[levelId]}</div>
          </div>

          <div style={{ fontSize: '18px', fontWeight: 800, color: progressPct >= 70 ? '#34d399' : '#fb923c', fontFamily: FONT }}>{progressPct}%</div>
        </div>

        <div style={{ padding: '13px 18px', borderRadius: '14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', fontFamily: FONT }}>הושלמו {completedCount} מתוך {level.exercises.length}</div>
          <div style={{ fontSize: '14px', color: '#fbbf24', fontFamily: FONT, fontWeight: 700 }}>⭐ {Object.values(levelProg?.exercises || {}).reduce((s, e) => s + (e.stars || 0), 0)}/30</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {level.exercises.map((_, idx) => {
            const exProg = levelProg?.exercises[idx];
            const isCurrent = idx === currentExerciseIndex;
            const isOpen = isDemoExerciseOpen(levelId, idx);

            return (
              <button
                key={idx}
                onClick={() => {
                  if (!isOpen) {
                    setShowDemoModal(true);
                    return;
                  }
                  onSelectExercise(idx);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  borderRadius: '15px',
                  background: isCurrent ? 'rgba(251,146,60,0.14)' : exProg?.completed ? 'rgba(52,211,153,0.07)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${isCurrent ? 'rgba(251,146,60,0.48)' : exProg?.completed ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.09)'}`,
                  opacity: isOpen ? 1 : 0.48,
                  backdropFilter: 'blur(12px)',
                  boxShadow: isCurrent ? '0 0 22px rgba(251,146,60,0.13)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  textAlign: 'right'
                }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 900, fontSize: '15px', background: isCurrent ? 'linear-gradient(135deg, #fb923c, #f59e0b)' : exProg?.completed ? 'rgba(52,211,153,0.22)' : 'rgba(255,255,255,0.09)', color: isCurrent ? '#1a0800' : exProg?.completed ? '#34d399' : 'rgba(255,255,255,0.5)', boxShadow: isCurrent ? '0 0 16px rgba(251,146,60,0.45)' : 'none' }}>
                  {isOpen ? (exProg?.completed ? '✓' : idx + 1) : '🔒'}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '16px', fontFamily: FONT }}>תרגיל {idx + 1}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontFamily: FONT, marginTop: '2px' }}>
                    {isOpen ? (exProg?.completed ? 'הושלם' : 'לחץ לנגן') : 'נעול בגרסת המתנה'}
                  </div>
                </div>

                {isOpen && exProg?.stars !== undefined && exProg.stars > 0 && <StarRating stars={exProg.stars} size="sm" />}
              </button>
            );
          })}
        </div>
      </div>

      {showDemoModal && <DemoUpgradeModal onClose={() => setShowDemoModal(false)} />}

      <Footer />
    </div>
  );
}