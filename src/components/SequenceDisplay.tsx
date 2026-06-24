import React from 'react';
import { HEBREW_NOTES } from '../data/levels';

interface SequenceDisplayProps {
  sequence: string[];
  label: string;
  playingIndex?: number;
  highlightColor?: string;
}

export default function SequenceDisplay({
  sequence,
  label,
  playingIndex = -1,
  highlightColor,
}: SequenceDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className="text-xs font-medium tracking-wider uppercase"
        style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Heebo', 'Assistant', sans-serif", letterSpacing: '0.08em' }}
      >
        {label}
      </span>
      <div className="flex gap-2 flex-wrap justify-center">
        {sequence.map((note, idx) => {
          const info = HEBREW_NOTES[note];
          const isPlaying = idx === playingIndex;
          return (
            <div
              key={idx}
              className="flex items-center justify-center rounded-xl font-bold transition-all duration-150"
              style={{
                width: '46px',
                height: '46px',
                background: isPlaying
                  ? `${info.color}cc`
                  : highlightColor || `${info.color}22`,
                border: `1.5px solid ${isPlaying ? info.color : info.color + '55'}`,
                color: isPlaying ? '#fff' : info.color,
                boxShadow: isPlaying ? `0 0 24px ${info.color}66` : `0 0 8px ${info.color}22`,
                transform: isPlaying ? 'scale(1.12)' : 'scale(1)',
                fontSize: '13px',
                fontFamily: "'Heebo', 'Assistant', sans-serif",
              }}
            >
              {info.hebrew}
            </div>
          );
        })}
      </div>
    </div>
  );
}
