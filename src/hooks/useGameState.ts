import { useState, useCallback } from 'react';
import { GamePhase, Profile, Achievement } from '../types';
import { saveProfile, updateStreak } from '../data/storage';

interface GameState {
  phase: GamePhase;
  userSequence: string[];
  attempts: number;
  score: number;
  showHints: boolean;
  playingIndex: number;
  isPlaying: boolean;
  newAchievement: Achievement | null;
}

const initialState: GameState = {
  phase: 'listen',
  userSequence: [],
  attempts: 0,
  score: 0,
  showHints: false,
  playingIndex: -1,
  isPlaying: false,
  newAchievement: null,
};

export function useGameState(profile: Profile, setProfile: (p: Profile) => void) {
  const [state, setState] = useState<GameState>(initialState);

  const reset = useCallback(() => {
    setState({ ...initialState });
  }, []);

  const addNote = useCallback((note: string) => {
    setState((prev) => {
      if (prev.phase !== 'practice') return prev;
      return { ...prev, userSequence: [...prev.userSequence, note] };
    });
  }, []);

  const removeLastNote = useCallback(() => {
    setState((prev) => ({
      ...prev,
      userSequence: prev.userSequence.slice(0, -1),
    }));
  }, []);

  const clearSequence = useCallback(() => {
    setState((prev) => ({ ...prev, userSequence: [] }));
  }, []);

  const startPractice = useCallback(() => {
    setState((prev) => ({ ...prev, phase: 'practice', isPlaying: false, playingIndex: -1 }));
  }, []);

  const setPlayingIndex = useCallback((index: number) => {
    setState((prev) => ({ ...prev, playingIndex: index, isPlaying: index >= 0 }));
  }, []);

  const setIsPlaying = useCallback((playing: boolean) => {
    setState((prev) => ({ ...prev, isPlaying: playing }));
  }, []);

  const clearNewAchievement = useCallback(() => {
    setState((prev) => ({ ...prev, newAchievement: null }));
  }, []);

  const submitAnswer = useCallback(
    (targetSequence: string[], levelId: number, exerciseIndex: number) => {
      if (state.userSequence.length === 0) return;

      const isCorrect =
        state.userSequence.length === targetSequence.length &&
        state.userSequence.every((n, i) => n === targetSequence[i]);

      const newAttempts = state.attempts + 1;

      if (isCorrect) {
        let stars = 0;
        if (newAttempts === 1) stars = 3;
        else if (newAttempts === 2) stars = 2;
        else if (newAttempts === 3) stars = 1;

        const updatedProfile = JSON.parse(JSON.stringify(profile)) as Profile;
        let newAchievement: Achievement | null = null;

        if (levelId > 0) {
          if (!updatedProfile.levelProgress[levelId]) {
            updatedProfile.levelProgress[levelId] = { exercises: {}, unlocked: true, completed: false };
          }
          const levelProg = updatedProfile.levelProgress[levelId];
          const existing = levelProg.exercises[exerciseIndex] || {
            stars: 0, attempts: 0, completed: false, bestScore: 0,
          };

          const starDiff = Math.max(0, stars - (existing.stars || 0));
          updatedProfile.totalStars += starDiff;
          levelProg.exercises[exerciseIndex] = {
            stars: Math.max(stars, existing.stars || 0),
            attempts: newAttempts,
            completed: true,
            bestScore: Math.max(stars, existing.bestScore || 0),
          };

          if (!updatedProfile.achievements.first_success.unlocked) {
            updatedProfile.achievements.first_success.unlocked = true;
            updatedProfile.achievements.first_success.unlockedAt = new Date().toISOString();
            newAchievement = updatedProfile.achievements.first_success;
          } else if (stars === 3 && !updatedProfile.achievements.perfect_score.unlocked) {
            updatedProfile.achievements.perfect_score.unlocked = true;
            updatedProfile.achievements.perfect_score.unlockedAt = new Date().toISOString();
            newAchievement = updatedProfile.achievements.perfect_score;
          }

          const completedCount = Object.values(levelProg.exercises).filter((e) => e.completed).length;
          if (completedCount === 10) {
            levelProg.completed = true;
            if (!updatedProfile.achievements.level_complete.unlocked) {
              updatedProfile.achievements.level_complete.unlocked = true;
              updatedProfile.achievements.level_complete.unlockedAt = new Date().toISOString();
              if (!newAchievement) newAchievement = updatedProfile.achievements.level_complete;
            }
          }
        }

        const withStreak = updateStreak(updatedProfile);
        saveProfile(withStreak);
        setProfile(withStreak);

        setState((prev) => ({
          ...prev,
          phase: 'correct',
          attempts: newAttempts,
          score: stars,
          isPlaying: false,
          playingIndex: -1,
          newAchievement,
        }));
      } else {
        const showHints = newAttempts >= 3;
        setState((prev) => ({
          ...prev,
          phase: 'incorrect',
          attempts: newAttempts,
          showHints,
          isPlaying: false,
          playingIndex: -1,
        }));
      }
    },
    [state.userSequence, state.attempts, profile, setProfile]
  );

  const tryAgain = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase: 'practice',
      userSequence: [],
      isPlaying: false,
      playingIndex: -1,
    }));
  }, []);

  return {
    state,
    reset,
    addNote,
    removeLastNote,
    clearSequence,
    startPractice,
    setPlayingIndex,
    setIsPlaying,
    clearNewAchievement,
    submitAnswer,
    tryAgain,
  };
}
