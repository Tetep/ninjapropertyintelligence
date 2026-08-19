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
