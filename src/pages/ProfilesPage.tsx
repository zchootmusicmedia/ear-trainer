import React, { useState } from 'react';
import { Profile } from '../types';
import { createProfile, setCurrentProfile, deleteProfile } from '../data/storage';
import Logo from '../components/Logo';
import Footer from '../components/Footer';

const AVATARS = ['🎹', '🎵', '🎶', '🎸', '🎺', '🎻', '🥁', '🎼'];
const FONT = "'Heebo', 'Assistant', sans-serif";
const FLOAT_NOTES = [
  { note: '♩', left: '7%',  delay: 0,   size: 20, color: 'rgba(251,146,60,0.22)' },
  { note: '♪', left: '19%', delay: 1.3, size: 15, color: 'rgba(167,139,250,0.2)' },
  { note: '♫', left: '34%', delay: 2.6, size: 24, color: 'rgba(251,191,36,0.2)'  },
  { note: '𝄞', left: '51%', delay: 0.9, size: 28, color: 'rgba(251,146,60,0.17)' },
  { note: '♬', left: '66%', delay: 2.0, size: 19, color: 'rgba(167,139,250,0.22)'},
  { note: '♩', left: '80%', delay: 3.2, size: 17, color: 'rgba(251,191,36,0.16)' },
  { note: '♪', left: '91%', delay: 0.5, size: 22, color: 'rgba(251,146,60,0.18)' },
];

interface ProfilesPageProps {
  profiles: Profile[];
  onSelect: (profile: Profile) => void;
  onProfilesChange: () => void;
}

export default function ProfilesPage({ profiles, onSelect, onProfilesChange }: ProfilesPageProps) {
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  const handleCreate = () => {
    if (!newName.trim()) return;
    const profile = createProfile(newName.trim(), selectedAvatar);
    onProfilesChange();
    onSelect(profile);
  };

  const handleSelect = (profile: Profile) => {
    setCurrentProfile(profile.id);
    onSelect(profile);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('האם למחוק פרופיל זה?')) {
      deleteProfile(id);
      onProfilesChange();
    }
  };

  return (
    <div dir="rtl" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Background glows */}
      <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: '70vw', height: '70vw', maxWidth: '680px', background: 'radial-gradient(circle, rgba(251,146,60,0.18) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0, animation: 'pulseGlow 4s ease-in-out infinite' }} />
      <div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: '65vw', height: '65vw', maxWidth: '640px', background: 'radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0, animation: 'pulseGlow 5.5s ease-in-out 1s infinite' }} />

      {/* Floating notes */}
      {FLOAT_NOTES.map((n, i) => (
        <div key={i} style={{ position: 'fixed', left: n.left, bottom: '-30px', fontSize: `${n.size}px`, color: n.color, pointerEvents: 'none', zIndex: 1, fontFamily: 'serif', animation: `floatNoteUp ${7 + i * 0.9}s ease-in-out ${n.delay}s infinite` }}>{n.note}</div>
      ))}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px 20px', position: 'relative', zIndex: 10 }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <Logo />

          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '28px', marginTop: '8px' }}>
            <div style={{ fontSize: '72px', lineHeight: 1, marginBottom: '14px', filter: 'drop-shadow(0 0 50px rgba(251,146,60,0.7)) drop-shadow(0 0 100px rgba(251,146,60,0.35))', animation: 'pulseGlow 3s ease-in-out infinite' }}>🎹</div>
            <h1 style={{ fontSize: '44px', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '16px', background: 'linear-gradient(135deg, #fb923c 0%, #fbbf24 45%, #c4b5fd 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: FONT }}>
              לנגן משמיעה
            </h1>

            {/* Welcome card */}
            <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)', borderRadius: '20px', padding: '18px 22px', backdropFilter: 'blur(20px)' }}>
              <p style={{ fontSize: '16px', lineHeight: 1.72, color: 'rgba(255,255,255,0.82)', fontFamily: FONT, fontWeight: 500, margin: 0 }}>
                רוצה לנגן שירים לפי שמיעה? כאן אנחנו מתחילים!
              </p>
              <p style={{ fontSize: '13px', lineHeight: 1.68, color: 'rgba(255,255,255,0.52)', fontFamily: FONT, margin: '6px 0 0' }}>
                מחכים לך כאן תרגילים לפיתוח שמיעה.
              </p>
              <p style={{ fontSize: '14px', lineHeight: 1.68, color: 'rgba(251,146,60,0.85)', fontFamily: FONT, fontWeight: 700, margin: '6px 0 0' }}>
                כשסיימת אותם – סימן שאת/ה מוכן/ה לנגן שירים מתוך שמיעה!!
              </p>
            </div>
          </div>

          {/* Profiles list */}
          {profiles.length > 0 && !creating && (
            <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelect(profile)}
                  onKeyDown={e => e.key === 'Enter' && handleSelect(profile)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '15px 18px', borderRadius: '18px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'right', boxSizing: 'border-box' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(251,146,60,0.12)'; (e.currentTarget as HTMLElement).style.border = '1px solid rgba(251,146,60,0.4)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(251,146,60,0.12)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                >
                  <span style={{ fontSize: '32px' }}>{profile.avatar}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: '#fff', fontSize: '18px', fontFamily: FONT }}>{profile.name}</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', fontFamily: FONT, marginTop: '2px' }}>⭐ {profile.totalStars} כוכבים · 🔥 {profile.streak} ימים</div>
                  </div>
                  <button onClick={e => handleDelete(e, profile.id)} style={{ color: 'rgba(248,113,113,0.5)', fontSize: '20px', padding: '4px 8px', opacity: 0, transition: 'opacity 0.2s', background: 'none', border: 'none', cursor: 'pointer' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0'; }}>×</button>
                </div>
              ))}
            </div>
          )}

          {/* Create / form */}
          {!creating ? (
            <button
              onClick={() => setCreating(true)}
              style={{ width: '100%', padding: '17px 22px', borderRadius: '18px', background: 'linear-gradient(135deg, rgba(251,146,60,0.97) 0%, rgba(245,158,11,0.93) 100%)', color: '#1a0800', fontFamily: FONT, fontWeight: 900, fontSize: '19px', border: '1px solid rgba(251,146,60,0.5)', boxShadow: '0 0 45px rgba(251,146,60,0.38), 0 5px 20px rgba(0,0,0,0.3)', cursor: 'pointer', transition: 'all 0.25s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 65px rgba(251,146,60,0.55), 0 5px 20px rgba(0,0,0,0.3)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 45px rgba(251,146,60,0.38), 0 5px 20px rgba(0,0,0,0.3)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
            >
              + צור פרופיל חדש
            </button>
          ) : (
            <div style={{ padding: '24px', borderRadius: '22px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', boxShadow: '0 0 40px rgba(251,146,60,0.1)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', textAlign: 'center', fontFamily: FONT, marginBottom: '18px' }}>פרופיל חדש</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '18px' }}>
                {AVATARS.map(av => (
                  <button key={av} onClick={() => setSelectedAvatar(av)} style={{ fontSize: '28px', width: '48px', height: '48px', borderRadius: '12px', background: selectedAvatar === av ? 'rgba(251,146,60,0.28)' : 'rgba(255,255,255,0.06)', border: selectedAvatar === av ? '2px solid rgba(251,146,60,0.75)' : '2px solid rgba(255,255,255,0.1)', boxShadow: selectedAvatar === av ? '0 0 18px rgba(251,146,60,0.35)' : 'none', cursor: 'pointer', transition: 'all 0.15s' }}>{av}</button>
                ))}
              </div>
              <input type="text" value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreate()} placeholder="השם שלך..." autoFocus style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', color: '#fff', textAlign: 'right', fontSize: '17px', fontFamily: FONT, outline: 'none', marginBottom: '14px', boxSizing: 'border-box' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleCreate} disabled={!newName.trim()} style={{ flex: 1, padding: '15px', borderRadius: '12px', background: newName.trim() ? 'linear-gradient(135deg, #fb923c, #f59e0b)' : 'rgba(255,255,255,0.07)', color: newName.trim() ? '#1a0800' : 'rgba(255,255,255,0.3)', fontFamily: FONT, fontWeight: 800, fontSize: '17px', boxShadow: newName.trim() ? '0 0 28px rgba(251,146,60,0.4)' : 'none', cursor: newName.trim() ? 'pointer' : 'not-allowed', border: 'none', transition: 'all 0.2s' }}>יאללה!</button>
                <button onClick={() => { setCreating(false); setNewName(''); }} style={{ flex: 1, padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)', fontFamily: FONT, fontWeight: 700, fontSize: '17px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}>ביטול</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
