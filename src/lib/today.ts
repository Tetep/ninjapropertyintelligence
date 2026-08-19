// Derives everything the Today screen needs from the raw stores.
// Nothing here writes state — it's pure read/compute so it's easy to
// reason about (and easy to replace with real scoring in Phase 3).

import type { DailyRecord, Level, ProtocolTask } from '../types/models'

/** Local YYYY-MM-DD, not UTC — a "day" should mean Tim's day, not GMT's. */
export function todayKey(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function tasksForDay(tasks: ProtocolTask[], date: Date = new Date()): ProtocolTask[] {
  const weekday = date.getDay()
  return tasks
    .filter((t) => t.active && t.schedule.includes(weekday as ProtocolTask['schedule'][number]))
    .sort((a, b) => a.sequence - b.sequence)
}

export function recordsForDate(records: DailyRecord[], date: string): DailyRecord[] {
  return records.filter((r) => r.date === date)
}

/**
 * The single next thing to do today: the earliest-sequence scheduled task
 * that doesn't yet have a record for today. Returns null once every
 * scheduled task for the day has been logged (completed OR skipped/missed
 * — a truthful "missed" still counts as handled, section 3B).
 */
export function getNextMission(
  tasks: ProtocolTask[],
  records: DailyRecord[],
  date: Date = new Date(),
): ProtocolTask | null {
  const scheduled = tasksForDay(tasks, date)
  const loggedTaskIds = new Set(recordsForDate(records, todayKey(date)).map((r) => r.taskId))
  return scheduled.find((t) => !loggedTaskIds.has(t.id)) ?? null
}

export interface TodayScoreSummary {
  earned: number
  max: number
}

/**
 * Points earned so far today vs. the max available today, counting only
 * "required" tasks so optional reflection prompts don't skew the score.
 * This is a placeholder sum for the Phase 1 shell — real weighting and
 * the 0-100 Daily Alignment Score land in Phase 3 (section 21).
 */
export function getTodayScore(
  tasks: ProtocolTask[],
  records: DailyRecord[],
  date: Date = new Date(),
): TodayScoreSummary {
  const scheduled = tasksForDay(tasks, date).filter((t) => t.required)
  const max = scheduled.reduce((sum, t) => sum + t.points, 0)
  const todays = recordsForDate(records, todayKey(date))
  const earned = scheduled.reduce((sum, t) => {
    const record = todays.find((r) => r.taskId === t.id)
    return record?.completion === 'completed' ? sum + record.points : sum
  }, 0)
  return { earned, max }
}

export interface DayProgress {
  date: string
  weekday: number
  earned: number
  max: number
  /** null when nothing was scheduled that day (max === 0) — distinct from a real 0. */
  ratio: number | null
  isToday: boolean
  hasActivity: boolean
}

/**
 * A short trailing window of daily scores — the "some kind of meter" for
 * Today. Deliberately not the full History screen (section 33, Phase 5):
 * this reuses getTodayScore per day rather than computed DailySummary
 * records, so it's honest about being a lightweight strip, not the real
 * weekly report.
 */
export function getWeekProgress(
  tasks: ProtocolTask[],
  records: DailyRecord[],
  date: Date = new Date(),
  days = 7,
): DayProgress[] {
  const todayStr = todayKey(date)
  const result: DayProgress[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(date)
    d.setDate(d.getDate() - i)
    const dStr = todayKey(d)
    const score = getTodayScore(tasks, records, d)
    result.push({
      date: dStr,
      weekday: d.getDay(),
      earned: score.earned,
      max: score.max,
      ratio: score.max > 0 ? score.earned / score.max : null,
      isToday: dStr === todayStr,
      hasActivity: recordsForDate(records, dStr).length > 0,
    })
  }
  return result
}

export type Mood = 'thriving' | 'good' | 'steady' | 'drift'

/**
 * Drives the character's animation (section 9/10: game-state feedback,
 * never a verdict on Tim). Blends today's ratio with the recent trend so
 * mood doesn't swing to "drift" just because it's 6am and nothing's
 * logged yet, and defaults to neutral rather than punishing on day one.
 */
export function getMood(weekProgress: DayProgress[]): Mood {
  const today = weekProgress.find((d) => d.isToday)
  // hasActivity, not just ratio !== null — a scheduled-but-untouched day
  // scores 0 same as a logged miss, but only a logged miss should count
  // as real drift. Otherwise a brand-new user reads as drift on day one.
  const priorRatios = weekProgress
    .filter((d) => !d.isToday && d.hasActivity && d.ratio !== null)
    .map((d) => d.ratio as number)
  const priorAvg = priorRatios.length
    ? priorRatios.reduce((sum, r) => sum + r, 0) / priorRatios.length
    : null

  let blended: number | null
  if (today?.hasActivity && today.ratio !== null) {
    blended = priorAvg !== null ? today.ratio * 0.65 + priorAvg * 0.35 : today.ratio
  } else {
    blended = priorAvg
  }

  if (blended === null) return 'steady'
  if (blended >= 0.8) return 'thriving'
  if (blended >= 0.55) return 'good'
  if (blended >= 0.3) return 'steady'
  return 'drift'
}

export function getCurrentLevel(levels: Level[], lifetimeXp: number): Level {
  const sorted = [...levels].sort((a, b) => a.level - b.level)
  return (
    [...sorted].reverse().find((l) => lifetimeXp >= l.xpRequired) ?? sorted[0]
  )
}

export function getNextLevel(levels: Level[], currentLevel: Level): Level | null {
  const sorted = [...levels].sort((a, b) => a.level - b.level)
  return sorted.find((l) => l.level === currentLevel.level + 1) ?? null
}
