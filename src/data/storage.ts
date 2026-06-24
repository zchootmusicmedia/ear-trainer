import { Profile, Achievement, DailyChallenge } from '../types';
import { LEVELS, DAILY_CHALLENGES_POOL } from './levels';

const STORAGE_KEY = 'lnagen_mishmiaa_v1';

export const DEFAULT_ACHIEVEMENTS: Record<string, Achievement> = {
  first_success: {
    id: 'first_success',
    title: 'הצלחה ראשונה!',
    description: 'ענית נכון לתרגיל ראשון',
    icon: '🌟',
    unlocked: false,
  },
  perfect_score: {
    id: 'perfect_score',
    title: 'ציון מושלם',
    description: 'קיבלת 3 כוכבים בתרגיל',
    icon: '💎',
    unlocked: false,
  },
  level_complete: {
    id: 'level_complete',
    title: 'רמה הושלמה',
    description: 'השלמת רמה שלמה',
    icon: '🏆',
    unlocked: false,
  },
  daily_challenge: {
    id: 'daily_challenge',
    title: 'אתגר יומי',
    description: 'השלמת אתגר יומי',
    icon: '☀️',
    unlocked: false,
  },
  streak_3: {
    id: 'streak_3',
    title: 'שלושה ימים רצוף',
    description: 'שיחקת 3 ימים ברצף',
    icon: '🔥',
    unlocked: false,
  },
  streak_7: {
    id: 'streak_7',
    title: 'שבוע שלם',
    description: 'שיחקת 7 ימים ברצף',
    icon: '💫',
    unlocked: false,
  },
};

function createDefaultProfile(name: string, avatar: string): Profile {
  const levelProgress: Profile['levelProgress'] = {};
  LEVELS.forEach((level) => {
    levelProgress[level.id] = {
      exercises: {},
      unlocked: true,
      completed: false,
    };
  });

  return {
    id: crypto.randomUUID(),
    name,
    avatar,
    createdAt: new Date().toISOString(),
    totalStars: 0,
    streak: 0,
    lastPlayedDate: '',
    levelProgress,
    achievements: { ...DEFAULT_ACHIEVEMENTS },
    dailyChallenges: {},
  };
}

interface StorageData {
  profiles: Profile[];
  currentProfileId: string | null;
}

function loadData(): StorageData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { profiles: [], currentProfileId: null };
}

function saveData(data: StorageData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getProfiles(): Profile[] {
  return loadData().profiles;
}

export function getCurrentProfileId(): string | null {
  return loadData().currentProfileId;
}

export function getCurrentProfile(): Profile | null {
  const data = loadData();
  if (!data.currentProfileId) return null;
  return data.profiles.find((p) => p.id === data.currentProfileId) || null;
}

export function createProfile(name: string, avatar: string): Profile {
  const data = loadData();
  const profile = createDefaultProfile(name, avatar);
  data.profiles.push(profile);
  data.currentProfileId = profile.id;
  saveData(data);
  return profile;
}

export function setCurrentProfile(id: string) {
  const data = loadData();
  data.currentProfileId = id;
  saveData(data);
}

export function deleteProfile(id: string) {
  const data = loadData();
  data.profiles = data.profiles.filter((p) => p.id !== id);
  if (data.currentProfileId === id) {
    data.currentProfileId = data.profiles[0]?.id || null;
  }
  saveData(data);
}

export function saveProfile(profile: Profile) {
  const data = loadData();
  const idx = data.profiles.findIndex((p) => p.id === profile.id);
  if (idx >= 0) {
    data.profiles[idx] = profile;
  } else {
    data.profiles.push(profile);
  }
  saveData(data);
}

export function getDailyChallenge(profileId: string): DailyChallenge {
  const data = loadData();
  const profile = data.profiles.find((p) => p.id === profileId);
  const today = new Date().toISOString().split('T')[0];

  if (profile?.dailyChallenges[today]) {
    return profile.dailyChallenges[today];
  }

  const dayIndex = Math.floor(Date.now() / 86400000) % DAILY_CHALLENGES_POOL.length;
  return {
    date: today,
    sequence: DAILY_CHALLENGES_POOL[dayIndex],
    completed: false,
    stars: 0,
  };
}

export function completeDailyChallenge(profileId: string, stars: number) {
  const data = loadData();
  const profile = data.profiles.find((p) => p.id === profileId);
  if (!profile) return;

  const today = new Date().toISOString().split('T')[0];
  profile.dailyChallenges[today] = {
    date: today,
    sequence: getDailyChallenge(profileId).sequence,
    completed: true,
    stars,
  };
  profile.totalStars += stars;

  if (!profile.achievements.daily_challenge.unlocked) {
    profile.achievements.daily_challenge.unlocked = true;
    profile.achievements.daily_challenge.unlockedAt = new Date().toISOString();
  }

  saveData(data);
  return profile;
}

export function updateStreak(profile: Profile): Profile {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (profile.lastPlayedDate === today) return profile;
  if (profile.lastPlayedDate === yesterday) {
    profile.streak += 1;
  } else {
    profile.streak = 1;
  }
  profile.lastPlayedDate = today;

  if (profile.streak >= 3 && !profile.achievements.streak_3.unlocked) {
    profile.achievements.streak_3.unlocked = true;
    profile.achievements.streak_3.unlockedAt = new Date().toISOString();
  }
  if (profile.streak >= 7 && !profile.achievements.streak_7.unlocked) {
    profile.achievements.streak_7.unlocked = true;
    profile.achievements.streak_7.unlockedAt = new Date().toISOString();
  }

  return profile;
}
