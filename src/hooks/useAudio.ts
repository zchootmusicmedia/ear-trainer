import { useRef, useCallback } from 'react';
import * as Tone from 'tone';

export function useAudio() {
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const initializedRef = useRef(false);

  const initialize = useCallback(async () => {
    if (initializedRef.current) return;
    await Tone.start();

    const reverb = new Tone.Reverb({ decay: 2.2, wet: 0.22 }).toDestination();
    await reverb.ready;

    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'triangle8',
      },
      envelope: {
        attack: 0.005,
        decay: 0.5,
        sustain: 0.3,
        release: 1.8,
      },
      volume: -4,
    });

    const chorus = new Tone.Chorus(2, 1.5, 0.3).start();
    synth.connect(chorus);
    chorus.connect(reverb);

    synthRef.current = synth;
    reverbRef.current = reverb;
    initializedRef.current = true;
  }, []);

  const playNote = useCallback(async (note: string, duration: number = 0.7) => {
    await initialize();
    if (synthRef.current) {
      synthRef.current.triggerAttackRelease(note, duration);
    }
  }, [initialize]);

  const playSequence = useCallback(async (
    notes: string[],
    tempo: number = 650,
    onNotePlay?: (index: number) => void
  ) => {
    await initialize();
    for (let i = 0; i < notes.length; i++) {
      if (onNotePlay) onNotePlay(i);
      await playNote(notes[i], 0.6);
      await new Promise<void>((resolve) => setTimeout(resolve, tempo));
    }
    if (onNotePlay) onNotePlay(-1);
  }, [initialize, playNote]);

  return { playNote, playSequence, initialize };
}
