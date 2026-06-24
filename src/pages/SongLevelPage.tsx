import React from 'react';
import { Profile } from '../types';
import { SONGS } from '../data/songs';
import Logo from '../components/Logo';
import Footer from '../components/Footer';

const FONT = "'Heebo', 'Assistant', sans-serif";

interface SongLevelPageProps {
  profile: Profile;
  onSelectSong: (index: number) => void;
  onBack: () => void;
}

export default function SongLevelPage({ profile, onSelectSong, onBack }: SongLevelPageProps) {
  const songProgress = profile.levelProgress[99]?.exercises || {};

  return (
    <div dir="rtl" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', top: '-15%', left: '-10%', width: '55vw', height: '55vw', maxWidth: '500px', background: 'radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', maxWidth: '480px', background: 'radial-gradient(circle, rgba(251,146,60,0.15) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ flex: 1, padding: '0 18px 10px', position: 'relative', zIndex: 10, maxWidth: '580px', margin: '0 auto', width: '100%' }}>
        <Logo />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', marginTop: '8px' }}>
          <button onClick={onBack} style={{ padding: '11px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', fontFamily: FONT, fontWeight: 700, fontSize: '15px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>← חזרה</button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: '22px', background: 'linear-gradient(135deg, #c4b5fd, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: FONT }}>ועכשיו — לשירים!</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: FONT, marginTop: '3px' }}>מזהים פתיחות ומנגנים משמיעה</div>
          </div>
          <div style={{ width: '72px' }} />
        </div>

        {/* Intro card */}
        <div style={{ padding: '20px', borderRadius: '20px', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.28)', marginBottom: '20px', textAlign: 'center', boxShadow: '0 0 40px rgba(167,139,250,0.12)' }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>🎵</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'rgba(255,255,255,0.82)', fontFamily: FONT, lineHeight: 1.65 }}>
            הגעת לשלב השירים!
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.48)', fontFamily: FONT, marginTop: '8px', lineHeight: 1.6 }}>
            קדימה — תזהו ותנגנו פתיחות של שירים שאתם מכירים
          </div>
        </div>

        {/* Song list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {SONGS.map((song, idx) => {
            const prog = songProgress[idx];
            const completed = prog?.completed;
            const stars = prog?.stars || 0;

            return (
              <button
                key={song.id}
                onClick={() => onSelectSong(idx)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', borderRadius: '18px', background: completed ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.06)', border: `1px solid ${completed ? 'rgba(52,211,153,0.28)' : 'rgba(255,255,255,0.1)'}`, backdropFilter: 'blur(16px)', cursor: 'pointer', textAlign: 'right', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(167,139,250,0.14)'; (e.currentTarget as HTMLElement).style.border = '1px solid rgba(167,139,250,0.38)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(167,139,250,0.12)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = completed ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.border = `1px solid ${completed ? 'rgba(52,211,153,0.28)' : 'rgba(255,255,255,0.1)'}`; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: completed ? 'linear-gradient(135deg, #34d399, #10b981)' : 'rgba(167,139,250,0.18)', fontWeight: 900, fontSize: '16px', color: completed ? '#001a0e' : '#c4b5fd', boxShadow: completed ? '0 0 16px rgba(52,211,153,0.35)' : 'none' }}>
                  {completed ? '✓' : idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, color: '#fff', fontSize: '17px', fontFamily: FONT }}>{song.buttonLabel}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', fontFamily: FONT, marginTop: '2px' }}>
                    {completed ? `הושלם · ${stars} ⭐` : 'לחץ להתחיל'}
                  </div>
                </div>
                <div style={{ fontSize: '22px', opacity: 0.65 }}>🎵</div>
              </button>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}
