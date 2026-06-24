import { useState, useCallback, useEffect } from 'react';
import { Profile } from './types';
import { getProfiles, getCurrentProfile, saveProfile } from './data/storage';
import { getDailyChallenge } from './data/storage';
import ProfilesPage from './pages/ProfilesPage';
import LevelSelectPage from './pages/LevelSelectPage';
import ExerciseListPage from './pages/ExerciseListPage';
import GamePage from './pages/GamePage';
import AchievementsPage from './pages/AchievementsPage';
import SongLevelPage from './pages/SongLevelPage';
import SongExercisePage from './pages/SongExercisePage';
import Logo from './components/Logo';

const FONT = "'Heebo', 'Assistant', sans-serif";

type AppView = 'profiles' | 'levelSelect' | 'exerciseList' | 'game' | 'dailyChallenge' | 'achievements' | 'songLevel' | 'songExercise';

function IframeBlockedScreen() {
  return (
    <div dir="rtl" style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '40px 24px',
      background: 'linear-gradient(160deg, #1e0d35 0%, #2d1550 28%, #391860 55%, #261140 78%, #1a0a2e 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '60vw', height: '60vw', maxWidth: '500px', background: 'radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '55vw', height: '55vw', maxWidth: '480px', background: 'radial-gradient(circle, rgba(251,146,60,0.13) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 10, maxWidth: '400px' }}>
        <Logo />
        <div style={{ fontSize: '64px', marginBottom: '20px', marginTop: '12px', filter: 'drop-shadow(0 0 40px rgba(167,139,250,0.5))' }}>🎹</div>
        <div style={{
          padding: '32px 28px', borderRadius: '28px',
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(24px)', boxShadow: '0 0 60px rgba(167,139,250,0.1)',
        }}>
          <p style={{
            fontSize: '22px', fontWeight: 700, lineHeight: 1.6,
            color: 'rgba(255,255,255,0.85)', fontFamily: FONT, marginBottom: '28px',
          }}>
            יש להיכנס למשחק דרך מערכת הלמידה
          </p>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: '14px 36px', borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(167,139,250,0.9), rgba(139,92,246,0.85))',
              color: '#fff', fontSize: '17px', fontWeight: 700,
              fontFamily: FONT, border: '1px solid rgba(167,139,250,0.5)',
              boxShadow: '0 0 30px rgba(167,139,250,0.3)', cursor: 'pointer',
            }}
          >
            חזרה
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isIframe] = useState(() => {
    try { return window.self !== window.top; } catch { return true; }
  });

  const [view, setView] = useState<AppView>('profiles');
  const [profiles, setProfiles] = useState<Profile[]>(getProfiles());
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [selectedExercise, setSelectedExercise] = useState(0);
  const [selectedSongIndex, setSelectedSongIndex] = useState(0);

  useEffect(() => {
    const profile = getCurrentProfile();
    if (profile) {
      setCurrentProfile(profile);
      setView('levelSelect');
    }
  }, []);

  const refreshProfiles = useCallback(() => { setProfiles(getProfiles()); }, []);

  const handleProfileSelect = useCallback((profile: Profile) => {
    setCurrentProfile(profile);
    setView('levelSelect');
  }, []);

  const handleProfileUpdate = useCallback((profile: Profile) => {
    setCurrentProfile({ ...profile });
    saveProfile(profile);
    refreshProfiles();
  }, [refreshProfiles]);

  const handleSelectLevel = useCallback((levelId: number) => {
    setSelectedLevel(levelId);
    setSelectedExercise(0);
    setView('exerciseList');
  }, []);

  const handleSelectExercise = useCallback((index: number) => {
    setSelectedExercise(index);
    setView('game');
  }, []);

  const handleNextExercise = useCallback(() => {
    const next = selectedExercise + 1;
    if (next < 10) setSelectedExercise(next);
  }, [selectedExercise]);

  const handlePrevExercise = useCallback(() => {
    const prev = selectedExercise - 1;
    if (prev >= 0) setSelectedExercise(prev);
  }, [selectedExercise]);

  const handleSelectSong = useCallback((index: number) => {
    setSelectedSongIndex(index);
    setView('songExercise');
  }, []);

  const handleNextSong = useCallback(() => {
    const next = selectedSongIndex + 1;
    if (next < 5) {
      setSelectedSongIndex(next);
    } else {
      setView('songLevel');
    }
  }, [selectedSongIndex]);

  const daily = currentProfile ? getDailyChallenge(currentProfile.id) : null;

  if (!isIframe) return <IframeBlockedScreen />;

  return (
    <div dir="rtl" style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #1e0d35 0%, #2d1550 28%, #391860 55%, #261140 78%, #1a0a2e 100%)',
      fontFamily: FONT, overflowX: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; background: #1e0d35; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(167,139,250,0.3); border-radius: 2px; }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes pulseGlow { 0%,100% { opacity:0.7; } 50% { opacity:1; } }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes floatNoteUp {
          0%   { transform: translateY(0) rotate(0deg) scale(0.8); opacity: 0; }
          8%   { opacity: 1; }
          88%  { opacity: 0.6; }
          100% { transform: translateY(-108vh) rotate(20deg) scale(1); opacity: 0; }
        }
      `}</style>

      {view === 'profiles' && (
        <ProfilesPage profiles={profiles} onSelect={handleProfileSelect} onProfilesChange={refreshProfiles} />
      )}
      {view === 'levelSelect' && currentProfile && (
        <LevelSelectPage
          profile={currentProfile}
          onSelectLevel={handleSelectLevel}
          onSongLevel={() => setView('songLevel')}
          onDailyChallenge={() => setView('dailyChallenge')}
          onBack={() => setView('profiles')}
          onAchievements={() => setView('achievements')}
        />
      )}
      {view === 'exerciseList' && currentProfile && (
        <ExerciseListPage
          profile={currentProfile}
          levelId={selectedLevel}
          currentExerciseIndex={selectedExercise}
          onSelectExercise={handleSelectExercise}
          onBack={() => setView('levelSelect')}
        />
      )}
      {view === 'game' && currentProfile && (
        <GamePage
          profile={currentProfile}
          setProfile={handleProfileUpdate}
          levelId={selectedLevel}
          exerciseIndex={selectedExercise}
          onNext={handleNextExercise}
          onPrev={handlePrevExercise}
          onOpenList={() => setView('exerciseList')}
          onBack={() => setView('exerciseList')}
        />
      )}
      {view === 'dailyChallenge' && currentProfile && daily && (
        <GamePage
          profile={currentProfile}
          setProfile={handleProfileUpdate}
          levelId={0}
          exerciseIndex={0}
          isDaily
          dailySequence={daily.sequence}
          onNext={() => setView('levelSelect')}
          onPrev={() => setView('levelSelect')}
          onOpenList={() => setView('levelSelect')}
          onBack={() => setView('levelSelect')}
        />
      )}
      {view === 'achievements' && currentProfile && (
        <AchievementsPage profile={currentProfile} onBack={() => setView('levelSelect')} />
      )}
      {view === 'songLevel' && currentProfile && (
        <SongLevelPage
          profile={currentProfile}
          onSelectSong={handleSelectSong}
          onBack={() => setView('levelSelect')}
        />
      )}
      {view === 'songExercise' && currentProfile && (
        <SongExercisePage
          profile={currentProfile}
          setProfile={handleProfileUpdate}
          songIndex={selectedSongIndex}
          onBack={() => setView('songLevel')}
          onNext={handleNextSong}
        />
      )}
    </div>
  );
}
