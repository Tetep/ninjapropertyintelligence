// Local persistence layer.
//
// v1 is single-user and local-only (localStorage), on purpose — see build
// philosophy, section 36: simplicity and speed first. Everything reads and
// writes through this module so a real backend can replace the guts later
// without touching components.

import type { Belief, DailyRecord, IdentityAnswers, Level, ProtocolTask, User } from '../types/models'
import { SEED_BELIEFS, SEED_LEVELS, SEED_PROTOCOL_TASKS, SEED_USER } from '../data/seed'

const KEYS = {
  user: 'isa:user',
  beliefs: 'isa:beliefs',
  levels: 'isa:levels',
  protocolTasks: 'isa:protocolTasks',
  dailyRecords: 'isa:dailyRecords',
  identityAnswers: 'isa:identityAnswers',
} as const

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

/** Seeds any missing collections on first run. Safe to call every load. */
function ensureSeeded(): void {
  if (!localStorage.getItem(KEYS.user)) write(KEYS.user, SEED_USER)
  if (!localStorage.getItem(KEYS.beliefs)) write(KEYS.beliefs, SEED_BELIEFS)
  if (!localStorage.getItem(KEYS.levels)) write(KEYS.levels, SEED_LEVELS)
  if (!localStorage.getItem(KEYS.protocolTasks)) write(KEYS.protocolTasks, SEED_PROTOCOL_TASKS)
  if (!localStorage.getItem(KEYS.dailyRecords)) write(KEYS.dailyRecords, [] as DailyRecord[])
}

export const store = {
  init(): void {
    ensureSeeded()
  },

  getUser(): User {
    return read(KEYS.user, SEED_USER)
  },
  saveUser(user: User): void {
    write(KEYS.user, user)
  },

  getBeliefs(): Belief[] {
    return read(KEYS.beliefs, SEED_BELIEFS)
      .filter((b) => b.active)
      .sort((a, b) => a.order - b.order)
  },

  getLevels(): Level[] {
    return read(KEYS.levels, SEED_LEVELS).sort((a, b) => a.level - b.level)
  },

  getProtocolTasks(): ProtocolTask[] {
    return read(KEYS.protocolTasks, SEED_PROTOCOL_TASKS)
  },
  saveProtocolTasks(tasks: ProtocolTask[]): void {
    write(KEYS.protocolTasks, tasks)
  },

  getDailyRecords(): DailyRecord[] {
    return read(KEYS.dailyRecords, [] as DailyRecord[])
  },
  saveDailyRecords(records: DailyRecord[]): void {
    write(KEYS.dailyRecords, records)
  },

  getIdentityAnswers(): IdentityAnswers | null {
    return read<IdentityAnswers | null>(KEYS.identityAnswers, null)
  },
  saveIdentityAnswers(answers: IdentityAnswers): void {
    write(KEYS.identityAnswers, answers)
  },

  /** Wipes all local app data. Not exposed in the UI yet — dev convenience. */
  resetAll(): void {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k))
    ensureSeeded()
  },
}
