// Core data model for the Identity Shift app.
// See section 34 of the product brief for the source spec.
// Everything is stored as plain JSON (see src/lib/storage.ts) so this
// shape doubles as the persistence schema for now.

export type AvatarState =
  | 'wanderer'
  | 'apprentice'
  | 'disciple'
  | 'operator'
  | 'warrior'
  | 'sensei'
  | 'ninja-master'
  | 'badass-ninja-master'
  | 'drift-mode'

export interface User {
  id: string
  name: string
  identityStatement: string
  currentLevel: number
  lifetimeXp: number
  avatarState: AvatarState
  createdAt: string
}

export interface Belief {
  id: string
  belief: string
  meaning: string
  order: number
  active: boolean
}

export type TaskCategory =
  | 'morning'
  | 'gym'
  | 'transition'
  | 'entrepreneur'
  | 'substance'
  | 'night_prep'
  | 'reflection'

/**
 * Which days a task shows up on. Days are 0 (Sun) - 6 (Sat), matching
 * Date#getDay(). Kept as an explicit list rather than a named schedule
 * enum so Settings (future phase) can edit it freely per task.
 */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

export const MON_FRI: Weekday[] = [1, 2, 3, 4, 5]
export const MON_WED_FRI: Weekday[] = [1, 3, 5]
export const TUE_THU: Weekday[] = [2, 4]
export const MON_THU: Weekday[] = [1, 2, 3, 4]
export const DAILY: Weekday[] = [0, 1, 2, 3, 4, 5, 6]

export interface ProtocolTask {
  id: string
  name: string
  description?: string
  icon: string
  category: TaskCategory
  schedule: Weekday[]
  /** Order within the day's overall sequence. Lower = earlier. */
  sequence: number
  points: number
  required: boolean
  active: boolean
  /**
   * What completing this task is evidence of — shown right after the user
   * logs it. This is the identity-conditioning half of the loop (section
   * 7): "more important than the points." Optional so milestone/reflection
   * entries can skip it.
   */
  evidenceText?: string
}

/**
 * The evidence record. One row per (date, task) once the user acts on it.
 * Every meaningful behavior becomes one of these (section 35) so XP,
 * streaks, and summaries can all be derived rather than hard-coded.
 */
export interface DailyRecord {
  id: string
  date: string // YYYY-MM-DD, local
  taskId: string
  completion: 'completed' | 'skipped' | 'missed'
  timestamp: string // ISO
  points: number
  note?: string
}

export type RecoveryStatus = 'on-protocol' | 'recovering' | 'off-protocol'

export interface DailySummary {
  date: string
  totalScore: number
  maxScore: number
  alignmentPercentage: number
  streak: number
  recoveryStatus: RecoveryStatus
}

export interface Level {
  level: number
  title: string
  xpRequired: number
  avatarAsset: AvatarState
}

/**
 * The raw answers behind the master identity statement (section 5) —
 * "Identity → Beliefs → Standards → Behaviors → Evidence → Reinforced
 * Identity" starts here. Kept distinct from User.identityStatement so the
 * edited/composed statement and the honest source material both survive —
 * a future AI coach can reference "in your own words" against these.
 */
export interface IdentityAnswers {
  currentIdentity: string
  currentPatterns: string
  targetIdentity: string
  targetStandards: string
  updatedAt: string
}
