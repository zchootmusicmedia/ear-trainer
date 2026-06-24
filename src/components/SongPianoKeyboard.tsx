import React, { useCallback, useState } from 'react';

const FONT = "'Heebo', 'Assistant', sans-serif";

const WHITE_NOTES = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
const WHITE_HEBREW: Record<string, string> = {
  'C4': 'דו', 'D4': 'רה', 'E4': 'מי', 'F4': 'פה',
  'G4': 'סול', 'A4': 'לה', 'B4': 'סי', 'C5': 'דו׳',
};
const WHITE_COLOR: Record<string, string> = {
  'C4': '#f97316', 'D4': '#eab308', 'E4': '#22c55e', 'F4': '#06b6d4',
  'G4': '#6366f1', 'A4': '#a855f7', 'B4': '#ec4899', 'C5': '#f97316',
};

const BLACK_NOTES = ['C#4', 'D#4', 'F#4', 'G#4', 'A#4'];
const BLACK_HEBREW: Record<string, string> = {
  'F#4': 'פה#',
  'G#4': 'סול#',
};
const BLACK_OFFSETS: Record<string, number> = {
  'C#4': 0.67,
  'D#4': 1.67,
  'F#4': 3.67,
  'G#4': 4.67,
  'A#4': 5.67,
};

const KEY_WIDTH = 54;
const KEY_GAP = 4;
const BLACK_KEY_WIDTH = 34;
const BLACK_KEY_HEIGHT = 104;
const WHITE_KEY_HEIGHT = 165;

interface SongPianoKeyboardProps {
  onNotePlay: (note: string) => void;
  activeNotes?: string[];
  disabled?: boolean;
}

export default function SongPianoKeyboard({ onNotePlay, activeNotes = [], disabled = false }: SongPianoKeyboardProps) {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const handlePress = useCallback((note: string) => {
    if (disabled) return;
    setPressedKey(note);
    onNotePlay(note);
    setTimeout(() => setPressedKey(k => k === note ? null : k), 180);
  }, [disabled, onNotePlay]);

  const isActive = (note: string) => pressedKey === note || activeNotes.includes(note);
  const totalWidth = WHITE_NOTES.length * (KEY_WIDTH + KEY_GAP) - KEY_GAP;

  return (
    <div dir="ltr" style={{ direction: 'ltr', userSelect: 'none' }}>
      <div style={{
        position: 'relative',
        width: totalWidth + 32,
        padding: '16px 16px 0 16px',
        background: 'linear-gradient(180deg, rgba(15,12,41,0.95) 0%, rgba(10,8,30,0.98) 100%)',
        borderRadius: '20px',
        boxShadow: '0 0 60px rgba(251,146,60,0.12), 0 20px 60px rgba(0,0,0,0.8)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ position: 'relative', display: 'flex', gap: KEY_GAP + 'px' }}>

          {/* White keys */}
          {WHITE_NOTES.map(note => {
            const pressed = isActive(note);
            const color = WHITE_COLOR[note];
            return (
              <div
                key={note}
                onMouseDown={() => handlePress(note)}
                onTouchStart={e => { e.preventDefault(); handlePress(note); }}
                style={{
                  width: KEY_WIDTH,
                  height: WHITE_KEY_HEIGHT,
                  borderRadius: '0 0 13px 13px',
                  background: pressed
                    ? `linear-gradient(180deg, ${color}cc 0%, ${color}ff 100%)`
                    : 'linear-gradient(180deg, rgba(240,235,255,0.92) 0%, rgba(210,200,245,0.85) 100%)',
                  border: pressed ? `1px solid ${color}` : '1px solid rgba(255,255,255,0.15)',
                  boxShadow: pressed
                    ? `0 0 30px ${color}99, 0 0 60px ${color}44, 0 6px 16px rgba(0,0,0,0.6), inset 0 1px 3px rgba(255,255,255,0.2)`
                    : '0 4px 16px rgba(0,0,0,0.6), inset 0 1px 3px rgba(255,255,255,0.7)',
                  transform: pressed ? 'translateY(4px) scale(0.97)' : 'none',
                  transition: 'transform 0.08s ease, box-shadow 0.12s ease, background 0.12s ease',
                  display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                  paddingBottom: '10px',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  position: 'relative', zIndex: 10,
                }}
              >
                <span style={{
                  fontSize: '11px', fontWeight: 700,
                  color: pressed ? '#fff' : 'rgba(40,30,80,0.85)',
                  fontFamily: FONT, lineHeight: 1,
                  textShadow: pressed ? `0 0 10px ${color}` : 'none',
                }}>
                  {WHITE_HEBREW[note]}
                </span>
              </div>
            );
          })}

          {/* Black keys — interactive overlay */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: BLACK_KEY_HEIGHT, pointerEvents: 'none', zIndex: 20 }}>
            {BLACK_NOTES.map(bNote => {
              const leftPx = BLACK_OFFSETS[bNote] * (KEY_WIDTH + KEY_GAP);
              const pressed = isActive(bNote);
              const hebrewLabel = BLACK_HEBREW[bNote];
              return (
                <div
                  key={bNote}
                  onMouseDown={e => { e.stopPropagation(); handlePress(bNote); }}
                  onTouchStart={e => { e.preventDefault(); e.stopPropagation(); handlePress(bNote); }}
                  style={{
                    position: 'absolute', left: leftPx, top: 0,
                    width: BLACK_KEY_WIDTH, height: BLACK_KEY_HEIGHT,
                    borderRadius: '0 0 8px 8px',
                    background: pressed
                      ? 'linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)'
                      : 'linear-gradient(180deg, #1a1530 0%, #0a0818 100%)',
                    border: pressed ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.07)',
                    boxShadow: pressed
                      ? '0 0 18px rgba(99,102,241,0.7), 2px 4px 12px rgba(0,0,0,0.6)'
                      : '2px 4px 12px rgba(0,0,0,0.9), inset 0 1px 2px rgba(255,255,255,0.04)',
                    transform: pressed ? 'translateY(3px)' : 'none',
                    transition: 'transform 0.08s ease, background 0.1s ease, box-shadow 0.1s ease',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    pointerEvents: 'all',
                    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                    paddingBottom: '6px',
                  }}
                >
                  {hebrewLabel && (
                    <span style={{
                      fontSize: '9px', fontWeight: 700, color: pressed ? '#fff' : 'rgba(255,255,255,0.45)',
                      fontFamily: FONT, lineHeight: 1,
                    }}>
                      {hebrewLabel}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ height: '14px', margin: '0 -16px', background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%)', borderRadius: '0 0 20px 20px' }} />
      </div>
    </div>
  );
}
