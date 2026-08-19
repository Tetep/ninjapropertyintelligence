// Writes the evidence record itself. Reading/deriving from records lives
// in lib/today.ts; this is the one place that constructs and merges them,
// so every "meaningful behavior becomes an event" (section 35) the same
// way regardless of which screen triggered it.

import type { DailyRecord, ProtocolTask } from '../types/models'
import { todayKey } from './today'

export function buildDailyRecord(
  task: ProtocolTask,
  completion: DailyRecord['completion'],
  date: Date = new Date(),
  note?: string,
): DailyRecord {
  const dateKey = todayKey(date)
  return {
    id: `${dateKey}:${task.id}`,
    date: dateKey,
    taskId: task.id,
    completion,
    timestamp: date.toISOString(),
    points: completion === 'completed' ? task.points : 0,
    note,
  }
}

/** Replaces any existing record for the same (date, taskId), else appends. */
export function upsertRecord(records: DailyRecord[], record: DailyRecord): DailyRecord[] {
  const withoutExisting = records.filter((r) => !(r.date === record.date && r.taskId === record.taskId))
  return [...withoutExisting, record]
}
