export const DEMO_PAYMENT_URL =
  "https://private.invoice4u.co.il/newsite/he/clearing/public/i4u-clearing?ProductGuid=6d0aa898-23fd-4152-8533-179bb58e284d";

export function isDemoLevelOpen(levelId: number) {
  return levelId === 1 || levelId === 2;
}

export function isDemoExerciseOpen(levelId: number, exerciseIndex: number) {
  return isDemoLevelOpen(levelId) && exerciseIndex >= 0 && exerciseIndex < 4;
}