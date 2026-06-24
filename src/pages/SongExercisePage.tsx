import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Profile } from '../types';
import { Song, HEBREW_TO_NOTE, NOTE_TO_HEBREW } from '../data/songs';
import { SONGS } from '../data/songs';
import { useAudio } from '../hooks/useAudio';
import { saveProfile } from '../data/storage';
import SongPianoKeyboard from '../components/SongPianoKeyboard';
import Logo from '../components/Logo';
import Footer from '../components/Footer';

const FONT = "'Heebo', 'Assistant', sans-serif";

type SongPhase =
  | 'identify'
  | 'identify-wrong'
  | 'identify-correct'
  | 'play-opening'
  | 'play-submitting'
  | 'play-correct'
  | 'play-incorrect'
  | 'free-play';

interface SongExercisePageProps {
  profile: Profile;
  setProfile: (p: Profile) => void;
  songIndex: number;
  onBack: () => void;
  onNext: () => void;
}

export default function SongExercisePage({ profile, setProfile, songIndex, onBack, onNext }: SongExercisePageProps) {
  const song: Song = SONGS[songIndex];
  const { playSequence, initialize } = useAudio();

  const [phase, setPhase] = useState<SongPhase>('identify');
  const [isPlaying, setIsPlaying] = useState(false);
  const [userSequence, setUserSequence] = useState<string[]>([]); // Hebrew note names
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const isPlayingRef = useRef(false);

  useEffect(() => { initialize(); }, []);

  const playOpening = useCallback(async () => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    setIsPlaying(true);
    const toneNotes = song.opening.map(h => HEBREW_TO_NOTE[h] || h);
    await playSequence(toneNotes, 600, () => {});
    setIsPlaying(false);
    isPlayingRef.current = false;
  }, [song, playSequence]);

  const handleChoice = useCallback((choice: string) => {
    if (isPlaying) return;
    if (choice === song.title) {
      setPhase('identify-correct');
      setTimeout(() => {
        setPhase('play-opening');
        setUserSequence([]);
        setAttempts(0);
      }, 1500);
    } else {
      setPhase('identify-wrong');
    }
  }, [song.title, isPlaying]);

  const handleKeyPress = useCallback(async (toneNote: string) => {
    if (phase !== 'play-opening' || isPlaying) return;
    const heb = NOTE_TO_HEBREW[toneNote] || toneNote;
    setUserSequence(prev => [...prev, heb]);
  }, [phase, isPlaying]);

  const handleFreeKeyPress = useCallback(async (_toneNote: string) => {}, []);

  const handleSubmitOpening = useCallback(() => {
    if (userSequence.length === 0) return;
    setPhase('play-submitting');
    const correct = song.opening;
    const isCorrect = userSequence.length === correct.length &&
      userSequence.every((n, i) => n === correct[i]);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (isCorrect) {
      const stars = newAttempts === 1 ? 3 : newAttempts === 2 ? 2 : 1;
      setScore(stars);
      setPhase('play-correct');

      const updatedProfile = { ...profile };
      if (!updatedProfile.levelProgress[99]) {
        updatedProfile.levelProgress[99] = { exercises: {}, unlocked: true, completed: false };
      }
      const prev = updatedProfile.levelProgress[99].exercises[songIndex];
      if (!prev || stars > (prev.stars || 0)) {
        updatedProfile.levelProgress[99].exercises[songIndex] = {
          stars,
          attempts: newAttempts,
          completed: true,
          bestScore: stars,
        };
        if (!prev?.completed) updatedProfile.totalStars += stars;
      }
      saveProfile(updatedProfile);
      setProfile(updatedProfile);
    } else {
      setPhase('play-incorrect');
    }
  }, [userSequence, song.opening, attempts, profile, songIndex, setProfile]);

  const handleTryAgainOpening = useCallback(async () => {
    setUserSequence([]);
    setPhase('play-opening');
    await playOpening();
  }, [playOpening]);

  const isLastSong = songIndex >= SONGS.length - 1;

  return (
    <div dir="rtl" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', top: '-15%', left: '-5%', width: '55vw', height: '55vw', maxWidth: '480px', background: 'radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-10%', right: '-5%', width: '48vw', height: '48vw', maxWidth: '440px', background: 'radial-gradient(circle, rgba(251,146,60,0.14) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ flex: 1, padding: '0 16px 10px', position: 'relative', zIndex: 10, maxWidth: '680px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Logo />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', marginTop: '6px' }}>
          <button onClick={onBack} style={{ padding: '11px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', fontFamily: FONT, fontWeight: 700, fontSize: '15px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>← חזרה</button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: '17px', background: 'linear-gradient(135deg, #c4b5fd, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: FONT }}>{song.buttonLabel}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.32)', fontFamily: FONT, marginTop: '2px' }}>
              {phase === 'identify' || phase === 'identify-wrong' || phase === 'identify-correct' ? 'שלב 1 — זיהוי' : phase === 'free-play' ? 'שלב 3 — נגינה חופשית' : 'שלב 2 — נגינת הפתיחה'}
            </div>
          </div>
          <div style={{ width: '72px' }} />
        </div>

        {/* ===== STEP 1: IDENTIFY ===== */}
        {(phase === 'identify' || phase === 'identify-wrong' || phase === 'identify-correct') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {/* Instruction card */}
            <div style={{ padding: '22px', borderRadius: '22px', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.28)', backdropFilter: 'blur(20px)', textAlign: 'center', boxShadow: '0 0 40px rgba(167,139,250,0.1)' }}>
              {phase === 'identify-correct' ? (
                <>
                  <div style={{ fontSize: '42px', marginBottom: '10px' }}>🎉</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#34d399', fontFamily: FONT }}>מעולה! זיהית את הפתיחה!</div>
                  <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', fontFamily: FONT, marginTop: '8px' }}>עוברים לנגן...</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '36px', marginBottom: '10px' }}>👂</div>
                  <div style={{ fontSize: '19px', fontWeight: 800, color: 'rgba(255,255,255,0.88)', fontFamily: FONT, marginBottom: '16px' }}>זהו את הפתיחה של השיר</div>
                  {phase === 'identify-wrong' && (
                    <div style={{ marginBottom: '14px', padding: '12px', borderRadius: '12px', background: 'rgba(251,113,133,0.1)', border: '1px solid rgba(251,113,133,0.25)' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#fb7185', fontFamily: FONT }}>כמעט! נסי להקשיב שוב</div>
                    </div>
                  )}
                  <button
                    onClick={playOpening}
                    disabled={isPlaying}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', borderRadius: '14px', fontWeight: 900, fontSize: '16px', background: isPlaying ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, rgba(167,139,250,0.95), rgba(139,92,246,0.9))', color: isPlaying ? 'rgba(255,255,255,0.35)' : '#fff', fontFamily: FONT, border: '1px solid rgba(167,139,250,0.45)', boxShadow: isPlaying ? 'none' : '0 0 30px rgba(167,139,250,0.35)', cursor: isPlaying ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
                  >
                    {isPlaying ? (
                      <span style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                        <span style={{ animation: 'bounce 0.85s ease-in-out 0ms infinite', display: 'inline-block' }}>♩</span>
                        <span style={{ animation: 'bounce 0.85s ease-in-out 180ms infinite', display: 'inline-block' }}>♩</span>
                        <span style={{ animation: 'bounce 0.85s ease-in-out 360ms infinite', display: 'inline-block' }}>♩</span>
                      </span>
                    ) : '▶ נגן פתיחה'}
                  </button>
                </>
              )}
            </div>

            {/* Choices */}
            {phase !== 'identify-correct' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {song.choices.map(choice => (
                  <button
                    key={choice}
                    onClick={() => handleChoice(choice)}
                    disabled={isPlaying}
                    style={{ padding: '16px 12px', borderRadius: '16px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)', color: '#fff', fontFamily: FONT, fontWeight: 700, fontSize: '15px', textAlign: 'center', cursor: isPlaying ? 'not-allowed' : 'pointer', transition: 'all 0.18s', lineHeight: 1.4 }}
                    onMouseEnter={e => { if (!isPlaying) { (e.currentTarget as HTMLElement).style.background = 'rgba(167,139,250,0.18)'; (e.currentTarget as HTMLElement).style.border = '1px solid rgba(167,139,250,0.4)'; } }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.13)'; }}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== STEP 2: PLAY OPENING ===== */}
        {(phase === 'play-opening' || phase === 'play-submitting' || phase === 'play-correct' || phase === 'play-incorrect') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {/* Instruction */}
            <div style={{ padding: '18px 20px', borderRadius: '20px', background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.28)', textAlign: 'center' }}>
              {(phase === 'play-opening' || phase === 'play-submitting') && (
                <>
                  <div style={{ fontSize: '22px', marginBottom: '8px' }}>🎹</div>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: 'rgba(255,255,255,0.88)', fontFamily: FONT, lineHeight: 1.5 }}>
                    זיהית את הפתיחה? מעולה! נגני אותה כאן!
                  </div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: FONT, marginTop: '6px' }}>
                    נגני את {song.opening.length} התווים של הפתיחה
                  </div>
                </>
              )}
              {phase === 'play-correct' && (
                <>
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>🌟</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#34d399', fontFamily: FONT, marginBottom: '8px' }}>
                    {score === 3 ? 'מושלם!! 3 כוכבים!' : score === 2 ? 'כל הכבוד! 2 כוכבים!' : 'יפה מאוד! כוכב!'}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', fontSize: '24px' }}>
                    {Array.from({ length: 3 }, (_, i) => (
                      <span key={i} style={{ opacity: i < score ? 1 : 0.25 }}>⭐</span>
                    ))}
                  </div>
                </>
              )}
              {phase === 'play-incorrect' && (
                <>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>💙</div>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#fb7185', fontFamily: FONT }}>לא בדיוק — נסי שוב!</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: FONT, marginTop: '5px' }}>
                    הפתיחה מכילה {song.opening.length} תווים
                  </div>
                </>
              )}
            </div>

            {/* User sequence display */}
            {(phase === 'play-opening' || phase === 'play-submitting') && userSequence.length > 0 && (
              <div style={{ padding: '14px 16px', borderRadius: '16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: FONT, marginBottom: '8px', textAlign: 'right' }}>הנגינה שלך:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'flex-end' }}>
                  {userSequence.map((note, i) => (
                    <span key={i} style={{ padding: '5px 10px', borderRadius: '8px', background: 'rgba(167,139,250,0.18)', border: '1px solid rgba(167,139,250,0.3)', color: '#c4b5fd', fontSize: '14px', fontWeight: 700, fontFamily: FONT }}>{note}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Correct sequence reveal */}
            {(phase === 'play-correct' || phase === 'play-incorrect') && (
              <div style={{ padding: '14px 16px', borderRadius: '16px', background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.2)' }}>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: FONT, marginBottom: '8px', textAlign: 'right' }}>הרצף הנכון:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'flex-end' }}>
                  {song.opening.map((note, i) => (
                    <span key={i} style={{ padding: '5px 10px', borderRadius: '8px', background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399', fontSize: '13px', fontWeight: 700, fontFamily: FONT }}>{note}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Piano */}
            <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <div style={{ minWidth: 'max-content', padding: '0 4px' }}>
                <SongPianoKeyboard
                  onNotePlay={handleKeyPress}
                  disabled={phase !== 'play-opening' || isPlaying}
                />
              </div>
            </div>

            {/* Play replay button */}
            {(phase === 'play-opening' || phase === 'play-incorrect') && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={playOpening} disabled={isPlaying} style={{ flex: 1, padding: '13px', borderRadius: '13px', background: 'rgba(167,139,250,0.12)', color: '#c4b5fd', border: '1px solid rgba(167,139,250,0.28)', fontFamily: FONT, fontWeight: 700, fontSize: '15px', cursor: isPlaying ? 'not-allowed' : 'pointer' }}>▶ נגן שוב</button>
                <button onClick={() => setUserSequence([])} disabled={userSequence.length === 0} style={{ flex: 1, padding: '13px', borderRadius: '13px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: FONT, fontWeight: 700, fontSize: '15px', cursor: userSequence.length === 0 ? 'not-allowed' : 'pointer' }}>נקה</button>
              </div>
            )}

            {/* Action buttons */}
            {phase === 'play-opening' && (
              <button onClick={handleSubmitOpening} disabled={userSequence.length === 0} style={{ width: '100%', padding: '18px 22px', borderRadius: '18px', fontWeight: 900, fontSize: '19px', background: userSequence.length > 0 ? 'linear-gradient(135deg, rgba(251,146,60,0.97), rgba(245,158,11,0.93))' : 'rgba(255,255,255,0.06)', color: userSequence.length > 0 ? '#1a0800' : 'rgba(255,255,255,0.22)', fontFamily: FONT, border: userSequence.length > 0 ? '1px solid rgba(251,146,60,0.5)' : '1px solid rgba(255,255,255,0.08)', boxShadow: userSequence.length > 0 ? '0 0 42px rgba(251,146,60,0.4)' : 'none', cursor: userSequence.length === 0 ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
                אני רוצה להגיש תשובה ✋
              </button>
            )}
            {phase === 'play-incorrect' && (
              <button onClick={handleTryAgainOpening} style={{ width: '100%', padding: '18px', borderRadius: '18px', fontWeight: 900, fontSize: '19px', background: 'linear-gradient(135deg, rgba(251,146,60,0.95), rgba(245,158,11,0.9))', color: '#1a0800', fontFamily: FONT, boxShadow: '0 0 35px rgba(251,146,60,0.35)', border: '1px solid rgba(251,146,60,0.45)', cursor: 'pointer' }}>
                נסי שוב 💪
              </button>
            )}
            {phase === 'play-correct' && (
              <button onClick={() => setPhase('free-play')} style={{ width: '100%', padding: '18px', borderRadius: '18px', fontWeight: 900, fontSize: '19px', background: 'linear-gradient(135deg, rgba(52,211,153,0.94), rgba(16,185,129,0.9))', color: '#001a0e', fontFamily: FONT, boxShadow: '0 0 32px rgba(52,211,153,0.28)', border: '1px solid rgba(52,211,153,0.45)', cursor: 'pointer' }}>
                המשך לנגן את השיר ←
              </button>
            )}
          </div>
        )}

        {/* ===== STEP 3: FREE PLAY ===== */}
        {phase === 'free-play' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ padding: '22px 20px', borderRadius: '22px', background: 'linear-gradient(135deg, rgba(167,139,250,0.12), rgba(251,146,60,0.08))', border: '1px solid rgba(167,139,250,0.3)', textAlign: 'center', boxShadow: '0 0 40px rgba(167,139,250,0.1)' }}>
              <div style={{ fontSize: '38px', marginBottom: '10px' }}>🎶</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'rgba(255,255,255,0.9)', fontFamily: FONT, lineHeight: 1.6 }}>
                ועכשיו הגיע השלב המתקדם!!
              </div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', fontFamily: FONT, marginTop: '8px', lineHeight: 1.7 }}>
                נגנו את המשך השיר משמיעה 😊<br />
                לאט לאט! אתם מסוגלים!!
              </div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#c4b5fd', fontFamily: FONT, marginTop: '12px' }}>🎵 {song.title} 🎵</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <div style={{ minWidth: 'max-content', padding: '0 4px' }}>
                <SongPianoKeyboard onNotePlay={handleFreeKeyPress} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={onBack} style={{ flex: 1, padding: '15px', borderRadius: '15px', fontWeight: 700, fontSize: '16px', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)', fontFamily: FONT, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>← רשימת השירים</button>
              {!isLastSong ? (
                <button onClick={onNext} style={{ flex: 1, padding: '15px', borderRadius: '15px', fontWeight: 900, fontSize: '17px', background: 'linear-gradient(135deg, rgba(251,146,60,0.95), rgba(245,158,11,0.9))', color: '#1a0800', fontFamily: FONT, border: '1px solid rgba(251,146,60,0.45)', boxShadow: '0 0 28px rgba(251,146,60,0.3)', cursor: 'pointer' }}>
                  סיימתי — שיר הבא ←
                </button>
              ) : (
                <button onClick={onBack} style={{ flex: 1, padding: '15px', borderRadius: '15px', fontWeight: 900, fontSize: '17px', background: 'linear-gradient(135deg, rgba(52,211,153,0.94), rgba(16,185,129,0.9))', color: '#001a0e', fontFamily: FONT, border: '1px solid rgba(52,211,153,0.45)', boxShadow: '0 0 28px rgba(52,211,153,0.28)', cursor: 'pointer' }}>
                  סיימתי את השיר 🎉
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
