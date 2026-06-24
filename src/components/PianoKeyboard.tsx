import React, { useCallback, useState } from 'react';
import { HEBREW_NOTES, ALL_NOTES } from '../data/levels';

interface PianoKeyboardProps {
  onNotePlay: (note: string) => void;
  activeNotes?: string[];
  highlightedNotes?: string[];
  allowedNotes?: string[];
  disabled?: boolean;
  revealNotes?: string[];
}

const BLACK_KEYS = ['C#4', 'D#4', 'F#4', 'G#4', 'A#4', 'C#5'];
const BLACK_KEY_OFFSETS: Record<string, number> = {
  'C#4': 0.67,
  'D#4': 1.67,
  'F#4': 3.67,
  'G#4': 4.67,
  'A#4': 5.67,
  'C#5': 7.67,
};

const KEY_WIDTH = 58;
const KEY_GAP = 4;

export default function PianoKeyboard({
  onNotePlay,
  activeNotes = [],
  highlightedNotes = [],
  allowedNotes,
  disabled = false,
  revealNotes = [],
}: PianoKeyboardProps) {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const handlePress = useCallback(
    (note: string) => {
      if (disabled) return;
      if (allowedNotes && !allowedNotes.includes(note)) return;
      setPressedKey(note);
      onNotePlay(note);
      setTimeout(() => setPressedKey((k) => (k === note ? null : k)), 180);
    },
    [disabled, allowedNotes, onNotePlay]
  );

  const isPressed = (note: string) => pressedKey === note || activeNotes.includes(note);
  const isHighlighted = (note: string) => highlightedNotes.includes(note) || revealNotes.includes(note);
  const isRevealed = (note: string) => revealNotes.includes(note);
  const isDimmed = (note: string) => allowedNotes ? !allowedNotes.includes(note) : false;

  const totalWidth = ALL_NOTES.length * (KEY_WIDTH + KEY_GAP) - KEY_GAP;

  return (
    <div dir="ltr" style={{ direction: 'ltr', userSelect: 'none' }}>
      <div
        style={{
          position: 'relative',
          width: totalWidth + 32,
          padding: '16px 16px 0 16px',
          background: 'linear-gradient(180deg, rgba(15,12,41,0.95) 0%, rgba(10,8,30,0.98) 100%)',
          borderRadius: '20px',
          boxShadow: '0 0 60px rgba(251,146,60,0.12), 0 0 40px rgba(34,211,238,0.08), 0 20px 60px rgba(0,0,0,0.8)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ position: 'relative', display: 'flex', gap: KEY_GAP + 'px' }}>
          {ALL_NOTES.map((note) => {
            const pressed = isPressed(note);
            const highlighted = isHighlighted(note);
            const revealed = isRevealed(note);
            const dimmed = isDimmed(note);
            const info = HEBREW_NOTES[note];

            let keyBg: string;
            let keyBorder: string;
            let keyShadow: string;
            let labelColor: string;

            if (pressed) {
              keyBg = `linear-gradient(180deg, ${info.color}cc 0%, ${info.color}ff 100%)`;
              keyBorder = `1px solid ${info.color}`;
              keyShadow = `0 0 30px ${info.color}99, 0 0 60px ${info.color}44, 0 6px 16px rgba(0,0,0,0.6), inset 0 1px 3px rgba(255,255,255,0.2)`;
              labelColor = '#ffffff';
            } else if (revealed) {
              keyBg = `linear-gradient(180deg, ${info.color}66 0%, ${info.color}44 100%)`;
              keyBorder = `1px solid ${info.color}aa`;
              keyShadow = `0 0 20px ${info.color}55, 0 4px 12px rgba(0,0,0,0.5)`;
              labelColor = info.color;
            } else if (highlighted) {
              keyBg = `linear-gradient(180deg, rgba(251,146,60,0.25) 0%, rgba(251,146,60,0.12) 100%)`;
              keyBorder = `1px solid rgba(251,146,60,0.5)`;
              keyShadow = `0 0 16px rgba(251,146,60,0.3), 0 4px 12px rgba(0,0,0,0.5)`;
              labelColor = '#fb923c';
            } else if (dimmed) {
              keyBg = 'linear-gradient(180deg, rgba(30,25,60,0.8) 0%, rgba(20,15,45,0.9) 100%)';
              keyBorder = '1px solid rgba(255,255,255,0.04)';
              keyShadow = 'none';
              labelColor = 'rgba(255,255,255,0.15)';
            } else {
              keyBg = 'linear-gradient(180deg, rgba(240,235,255,0.92) 0%, rgba(210,200,245,0.85) 100%)';
              keyBorder = '1px solid rgba(255,255,255,0.15)';
              keyShadow = '0 4px 16px rgba(0,0,0,0.6), inset 0 1px 3px rgba(255,255,255,0.7)';
              labelColor = 'rgba(40,30,80,0.85)';
            }

            return (
              <div
                key={note}
                onMouseDown={() => handlePress(note)}
                onTouchStart={(e) => { e.preventDefault(); handlePress(note); }}
                style={{
                  width: KEY_WIDTH + 'px',
                  height: '170px',
                  borderRadius: '0 0 14px 14px',
                  background: keyBg,
                  border: keyBorder,
                  boxShadow: keyShadow,
                  transform: pressed ? 'translateY(4px) scale(0.97)' : 'none',
                  transition: 'transform 0.08s ease, box-shadow 0.12s ease, background 0.12s ease',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  paddingBottom: '10px',
                  cursor: dimmed ? 'not-allowed' : 'pointer',
                  opacity: dimmed ? 0.4 : 1,
                  position: 'relative',
                  zIndex: 10,
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: labelColor,
                    fontFamily: "'Heebo', 'Assistant', sans-serif",
                    textShadow: pressed ? `0 0 10px ${info.color}` : 'none',
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {info.hebrew}
                </span>
              </div>
            );
          })}

          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '108px',
              pointerEvents: 'none',
              zIndex: 20,
            }}
          >
            {BLACK_KEYS.map((bNote) => {
              const leftPx = BLACK_KEY_OFFSETS[bNote] * (KEY_WIDTH + KEY_GAP);
              return (
                <div
                  key={bNote}
                  style={{
                    position: 'absolute',
                    left: leftPx + 'px',
                    top: 0,
                    width: '36px',
                    height: '108px',
                    background: 'linear-gradient(180deg, #1a1530 0%, #0a0818 100%)',
                    borderRadius: '0 0 9px 9px',
                    border: '1px solid rgba(255,255,255,0.06)',
                    boxShadow: '2px 4px 12px rgba(0,0,0,0.9), inset 0 1px 2px rgba(255,255,255,0.04)',
                  }}
                />
              );
            })}
          </div>
        </div>

        <div
          style={{
            height: '14px',
            margin: '0 -16px',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%)',
            borderRadius: '0 0 20px 20px',
          }}
        />
      </div>
    </div>
  );
}
