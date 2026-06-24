import React, { useEffect, useCallback, useRef } from 'react';
import { Profile } from '../types';
import { LEVELS, LEVEL_NOTE_LABELS } from '../data/levels';
import { useAudio } from '../hooks/useAudio';
import { useGameState } from '../hooks/useGameState';
import PianoKeyboard from '../components/PianoKeyboard';
import SequenceDisplay from '../components/SequenceDisplay';
import StarRating from '../components/StarRating';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import AchievementToast from '../components/AchievementToast';

const FONT = "'Heebo', 'Assistant', sans-serif";

interface GamePageProps {
  profile: Profile;
  setProfile: (p: Profile) => void;
  levelId: number;
  exerciseIndex: number;
  isDaily?: boolean;
  dailySequence?: string[];
  onNext: () => void;
  onPrev: () => void;
  onOpenList: () => void;
  onBack: () => void;
}

export default function GamePage({ profile, setProfile, levelId, exerciseIndex, isDaily = false, dailySequence, onNext, onPrev, onOpenList, onBack }: GamePageProps) {
  const level = isDaily ? null : LEVELS.find((l) => l.id === levelId);
  const exercise = isDaily ? { sequence: dailySequence || [], label: 'אתגר יומי' } : level?.exercises[exerciseIndex];
  const targetSequence = exercise?.sequence || [];
  const allowedNotes = isDaily ? undefined : level?.notes;

  const { playNote, playSequence } = useAudio();
  const { state, reset, addNote, clearSequence, startPractice, setIsPlaying, submitAnswer, tryAgain, clearNewAchievement } = useGameState(profile, setProfile);

  const isPlayingRef = useRef(false);
  const currentSequenceRef = useRef(targetSequence);
  currentSequenceRef.current = targetSequence;

  const playTarget = useCallback(async () => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    setIsPlaying(true);
    await playSequence(currentSequenceRef.current, 680, () => {});
    setIsPlaying(false);
    isPlayingRef.current = false;
    startPractice();
  }, [playSequence, setIsPlaying, startPractice]);

  const replayForHint = useCallback(async () => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    setIsPlaying(true);
    await playSequence(currentSequenceRef.current, 780, () => {});
    setIsPlaying(false);
    isPlayingRef.current = false;
  }, [playSequence, setIsPlaying]);

  useEffect(() => {
    reset();
    isPlayingRef.current = false;
    const timer = setTimeout(() => { playTarget(); }, 450);
    return () => { clearTimeout(timer); isPlayingRef.current = false; };
  }, [levelId, exerciseIndex]);

  const handleNoteClick = useCallback(async (note: string) => {
    if (state.phase !== 'practice' || state.isPlaying) return;
    addNote(note);
    await playNote(note);
  }, [state.phase, state.isPlaying, addNote, playNote]);

  const handleSubmit = useCallback(() => {
    if (state.phase !== 'practice' || state.userSequence.length === 0 || state.isPlaying) return;
    submitAnswer(targetSequence, levelId, exerciseIndex);
  }, [state.phase, state.userSequence, state.isPlaying, targetSequence, levelId, exerciseIndex, submitAnswer]);

  const handleTryAgain = useCallback(async () => {
    const willReplay = state.showHints || state.attempts >= 3;
    tryAgain();
    if (willReplay) {
      await new Promise<void>(r => setTimeout(r, 150));
      await replayForHint();
    }
  }, [tryAgain, state.showHints, state.attempts, replayForHint]);

  const canSubmit = state.phase === 'practice' && state.userSequence.length > 0 && !state.isPlaying;
  const showHints = state.showHints || state.attempts >= 3;
  const pianoDisabled = state.phase !== 'practice' || state.isPlaying;
  const revealNotes = (state.phase === 'correct' || state.phase === 'incorrect') ? targetSequence : [];
  const hintHighlight = showHints && state.phase === 'practice' && !state.isPlaying ? (allowedNotes || []) : [];
  const attemptsLeft = Math.max(0, 3 - state.attempts);

  return (
    <div dir="rtl" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <AchievementToast achievement={state.newAchievement} onDismiss={clearNewAchievement} />

      <div style={{ position: 'fixed', top: '-15%', left: '-5%', width: '55vw', height: '55vw', maxWidth: '500px', background: 'radial-gradient(circle, rgba(251,146,60,0.15) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-5%', right: '-5%', width: '48vw', height: '48vw', maxWidth: '440px', background: 'radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ flex: 1, padding: '0 16px 10px', position: 'relative', zIndex: 10, maxWidth: '680px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Logo />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', marginTop: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <button onClick={onBack} style={{ padding: '11px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', fontFamily: FONT, fontWeight: 700, fontSize: '15px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>← חזרה</button>
            {!isDaily && (
              <button onClick={onOpenList} style={{ padding: '11px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', fontFamily: FONT, fontSize: '14px', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
                {exerciseIndex + 1} / 10
              </button>
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: '17px', background: isDaily ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : 'linear-gradient(135deg, #fb923c 0%, #fbbf24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: FONT }}>
              {isDaily ? '☀️ אתגר יומי' : level?.name}
            </div>
            {!isDaily && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.32)', fontFamily: FONT, marginTop: '2px' }}>{LEVEL_NOTE_LABELS[levelId]}</div>}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {!isDaily && exerciseIndex > 0 && (
              <button onClick={onPrev} style={{ width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', fontSize: '15px' }}>→</button>
            )}
            {!isDaily && exerciseIndex < 9 && (
              <button onClick={onNext} style={{ width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', fontSize: '15px' }}>←</button>
            )}
          </div>
        </div>

        {/* Feedback banners */}
        {state.phase === 'correct' && (
          <div style={{ marginBottom: '14px', padding: '18px', borderRadius: '20px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(52,211,153,0.15) 0%, rgba(16,185,129,0.08) 100%)', border: '1px solid rgba(52,211,153,0.4)', boxShadow: '0 0 35px rgba(52,211,153,0.13)' }}>
            <div style={{ fontSize: '36px', marginBottom: '6px' }}>{state.score === 3 ? '🎉' : state.score === 2 ? '⭐' : '👍'}</div>
            <div style={{ fontSize: '22px', fontWeight: 900, marginBottom: '10px', color: '#34d399', fontFamily: FONT }}>
              {state.score === 3 ? 'אלופה!' : state.score === 2 ? 'כל הכבוד!' : 'יפה מאוד!'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <StarRating stars={state.score} size="lg" />
            </div>
          </div>
        )}

        {state.phase === 'incorrect' && (
          <div style={{ marginBottom: '14px', padding: '16px 18px', borderRadius: '17px', textAlign: 'center', background: 'rgba(251,113,133,0.09)', border: '1px solid rgba(251,113,133,0.28)' }}>
            <div style={{ fontSize: '28px', marginBottom: '6px' }}>💙</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#fb7185', fontFamily: FONT }}>לא בדיוק — נסי שוב!</div>
            {showHints && (
              <div style={{ marginTop: '8px', fontSize: '14px', color: 'rgba(251,146,60,0.85)', fontFamily: FONT }}>
                💡 הרצף מכיל {targetSequence.length} תווים — התווים המותרים מסומנים
              </div>
            )}
          </div>
        )}

        {/* Main info panel */}
        <div style={{ marginBottom: '14px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: (state.phase === 'listen' || state.userSequence.length === 0) ? '0' : '14px' }}>
            <button
              onClick={playTarget}
              disabled={state.isPlaying}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '12px 20px', borderRadius: '12px', fontWeight: 900, fontSize: '15px', background: state.isPlaying ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, rgba(251,146,60,0.97) 0%, rgba(245,158,11,0.92) 100%)', color: state.isPlaying ? 'rgba(255,255,255,0.35)' : '#1a0800', opacity: state.isPlaying ? 0.75 : 1, fontFamily: FONT, boxShadow: state.isPlaying ? 'none' : '0 0 26px rgba(251,146,60,0.38)', border: state.isPlaying ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(251,146,60,0.45)', cursor: state.isPlaying ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
            >
              {state.isPlaying ? (
                <span style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                  <span style={{ animation: 'bounce 0.85s ease-in-out 0ms infinite', fontSize: '14px', display: 'inline-block' }}>♩</span>
                  <span style={{ animation: 'bounce 0.85s ease-in-out 180ms infinite', fontSize: '14px', display: 'inline-block' }}>♩</span>
                  <span style={{ animation: 'bounce 0.85s ease-in-out 360ms infinite', fontSize: '14px', display: 'inline-block' }}>♩</span>
                </span>
              ) : '▶ נגן שוב'}
            </button>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', fontFamily: FONT }}>
                {state.phase === 'listen' && state.isPlaying && 'מנגן...'}
                {state.phase === 'listen' && !state.isPlaying && 'מוכן?'}
                {state.phase === 'practice' && state.isPlaying && 'מנגן שוב...'}
                {state.phase === 'practice' && !state.isPlaying && 'עכשיו נגני!'}
                {state.phase === 'correct' && 'תשובה נכונה! ✓'}
                {state.phase === 'incorrect' && 'נסי שוב...'}
              </div>
              {state.phase === 'practice' && state.attempts > 0 && !state.isPlaying && (
                <div style={{ fontSize: '12px', marginTop: '3px', fontFamily: FONT, color: attemptsLeft > 0 ? 'rgba(251,146,60,0.65)' : 'rgba(251,113,133,0.65)' }}>
                  {attemptsLeft > 0 ? `${attemptsLeft} נסיונות לניקוד` : 'המשיכי לנסות!'}
                </div>
              )}
            </div>
          </div>

          {state.phase === 'listen' && !state.isPlaying && (
            <div style={{ textAlign: 'center', padding: '22px 0' }}>
              <div style={{ fontSize: '44px', marginBottom: '10px', filter: 'drop-shadow(0 0 22px rgba(251,146,60,0.55))' }}>👂</div>
              <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.42)', fontFamily: FONT }}>לחץ ▶ להאזין ואז נגן את הרצף</div>
            </div>
          )}
          {state.phase === 'listen' && state.isPlaying && (
            <div style={{ textAlign: 'center', padding: '22px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#fb923c', boxShadow: '0 0 12px #fb923c', animation: `bounce 0.85s ease-in-out ${i * 0.22}s infinite` }} />
                ))}
              </div>
              <div style={{ fontSize: '15px', color: 'rgba(251,146,60,0.65)', fontFamily: FONT }}>האזן לרצף...</div>
            </div>
          )}
          {state.phase === 'practice' && !state.isPlaying && (
            <div>
              {state.userSequence.length > 0 ? (
                <SequenceDisplay sequence={state.userSequence} label="הנגינה שלך" />
              ) : (
                <div style={{ textAlign: 'center', padding: '18px 0', fontSize: '15px', color: 'rgba(255,255,255,0.28)', fontFamily: FONT }}>לחץ על המקשים למטה...</div>
              )}
            </div>
          )}
          {state.phase === 'practice' && state.isPlaying && (
            <div style={{ textAlign: 'center', padding: '18px 0', fontSize: '15px', color: 'rgba(251,146,60,0.6)', fontFamily: FONT }}>מנגן שוב... האזן היטב</div>
          )}
          {(state.phase === 'correct' || state.phase === 'incorrect') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <SequenceDisplay sequence={targetSequence} label="הרצף הנכון" highlightColor="rgba(52,211,153,0.28)" />
              {state.userSequence.length > 0 && (
                <SequenceDisplay sequence={state.userSequence} label="התשובה שלך" highlightColor={state.phase === 'correct' ? 'rgba(52,211,153,0.18)' : 'rgba(251,113,133,0.18)'} />
              )}
            </div>
          )}
        </div>

        {/* Piano */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <div style={{ minWidth: 'max-content', padding: '0 4px' }}>
            <PianoKeyboard
              onNotePlay={handleNoteClick}
              activeNotes={!pianoDisabled && state.userSequence.length > 0 ? state.userSequence.slice(-1) : []}
              highlightedNotes={hintHighlight}
              revealNotes={revealNotes}
              allowedNotes={!pianoDisabled ? allowedNotes : undefined}
              disabled={pianoDisabled}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {state.phase === 'practice' && !state.isPlaying && (
            <>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                style={{ width: '100%', padding: '18px 22px', borderRadius: '18px', fontWeight: 900, fontSize: '19px', background: canSubmit ? 'linear-gradient(135deg, rgba(251,146,60,0.97) 0%, rgba(245,158,11,0.95) 100%)' : 'rgba(255,255,255,0.06)', color: canSubmit ? '#1a0800' : 'rgba(255,255,255,0.22)', boxShadow: canSubmit ? '0 0 42px rgba(251,146,60,0.42), 0 5px 20px rgba(0,0,0,0.35)' : 'none', border: canSubmit ? '1px solid rgba(251,146,60,0.5)' : '1px solid rgba(255,255,255,0.07)', fontFamily: FONT, cursor: canSubmit ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}
              >
                אני רוצה להגיש תשובה ✋
              </button>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={clearSequence} disabled={state.userSequence.length === 0} style={{ flex: 1, padding: '14px 14px', borderRadius: '13px', fontWeight: 700, fontSize: '15px', background: 'rgba(255,255,255,0.07)', color: state.userSequence.length > 0 ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.22)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: FONT, cursor: state.userSequence.length === 0 ? 'not-allowed' : 'pointer' }}>נקה תשובה</button>
                <button onClick={playTarget} disabled={state.isPlaying} style={{ flex: 1, padding: '14px 14px', borderRadius: '13px', fontWeight: 700, fontSize: '15px', background: 'rgba(251,146,60,0.12)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.28)', fontFamily: FONT, cursor: 'pointer' }}>▶ נגן שוב</button>
              </div>
            </>
          )}

          {state.phase === 'practice' && state.isPlaying && (
            <div style={{ width: '100%', padding: '18px', borderRadius: '18px', textAlign: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)', fontSize: '15px', fontFamily: FONT }}>
              ממתין לסיום הנגינה...
            </div>
          )}

          {state.phase === 'incorrect' && (
            <button onClick={handleTryAgain} style={{ width: '100%', padding: '18px 22px', borderRadius: '18px', fontWeight: 900, fontSize: '19px', background: 'linear-gradient(135deg, rgba(251,146,60,0.95), rgba(245,158,11,0.92))', color: '#1a0800', fontFamily: FONT, boxShadow: '0 0 35px rgba(251,146,60,0.35)', border: '1px solid rgba(251,146,60,0.45)', cursor: 'pointer', transition: 'all 0.2s' }}>
              נסי שוב 💪
            </button>
          )}

          {state.phase === 'correct' && (
            <div style={{ display: 'flex', gap: '10px' }}>
              {!isDaily && exerciseIndex > 0 && (
                <button onClick={onPrev} style={{ flex: 1, padding: '15px', borderRadius: '15px', fontWeight: 700, fontSize: '16px', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)', fontFamily: FONT, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>→ הקודם</button>
              )}
              {!isDaily && exerciseIndex < 9 ? (
                <button onClick={onNext} style={{ flex: 1, padding: '18px', borderRadius: '18px', fontWeight: 900, fontSize: '19px', background: 'linear-gradient(135deg, rgba(52,211,153,0.94), rgba(16,185,129,0.9))', color: '#001a0e', fontFamily: FONT, boxShadow: '0 0 32px rgba(52,211,153,0.28)', border: '1px solid rgba(52,211,153,0.45)', cursor: 'pointer' }}>הבא ←</button>
              ) : (
                <button onClick={onBack} style={{ flex: 1, padding: '18px', borderRadius: '18px', fontWeight: 900, fontSize: '19px', background: 'linear-gradient(135deg, rgba(251,146,60,0.94), rgba(245,158,11,0.9))', color: '#1a0800', fontFamily: FONT, boxShadow: '0 0 32px rgba(251,146,60,0.3)', border: '1px solid rgba(251,146,60,0.45)', cursor: 'pointer' }}>
                  {isDaily ? '← חזרה' : '← לתרגילים'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
