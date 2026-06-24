export type NoteName = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
export type OctaveNote = `${NoteName}4` | `${NoteName}5`;

export interface HebrewNote {
  note: string;
  octave: string;
  hebrew: string;
  color: string;
}

export interface Exercise {
  sequence: string[];
  label: string;
}

export interface Level {
  id: number;
  name: string;
  notes: string[];
  exercises: Exercise[];
  unlocked: boolean;
}

export interface ExerciseProgress {
  stars: number;
  attempts: number;
  completed: boolean;
  bestScore: number;
}

export interface LevelProgress {
  exercises: Record<number, ExerciseProgress>;
  unlocked: boolean;
  completed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface DailyChallenge {
  date: string;
  sequence: string[];
  completed: boolean;
  stars: number;
}

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  createdAt: string;
  totalStars: number;
  streak: number;
  lastPlayedDate: string;
  levelProgress: Record<number, LevelProgress>;
  achievements: Record<string, Achievement>;
  dailyChallenges: Record<string, DailyChallenge>;
}

export type GamePhase = 'listen' | 'practice' | 'submitted' | 'correct' | 'incorrect';
