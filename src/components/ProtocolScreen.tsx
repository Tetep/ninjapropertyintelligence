import { useEffect, useRef, useState } from 'react'
import type { DailyRecord, ProtocolTask } from '../types/models'
import { getNextMission, tasksForDay, todayKey } from '../lib/today'

const CATEGORY_LABEL: Record<ProtocolTask['category'], string> = {
  night_prep: 'Night Prep',
  morning: 'Morning Protocol',
  gym: 'Training',
  transition: 'Transition',
  entrepreneur: 'Entrepreneur Mode',
  substance: 'Clear Mind',
  reflection: 'Reflection',
}

const TOAST_MS = 1400

interface Toast {
  headline: string
  body?: string
}

interface ProtocolScreenProps {
  tasks: ProtocolTask[]
  records: DailyRecord[]
  onRecord: (task: ProtocolTask, completion: DailyRecord['completion'], note?: string) => void
}

export function ProtocolScreen({ tasks, records, onRecord }: ProtocolScreenProps) {
  const [toast, setToast] = useState<Toast | null>(null)
  const [reflectionText, setReflectionText] = useState('')
  const timeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  const scheduled = tasksForDay(tasks)
  const loggedIds = new Set(records.filter((r) => r.date === todayKey()).map((r) => r.taskId))
  const doneCount = scheduled.filter((t) => loggedIds.has(t.id)).length
  const currentTask = getNextMission(tasks, records)

  function showToastThenAdvance(headline: string, body: string | undefined, task: ProtocolTask, completion: DailyRecord['completion'], note?: string) {
    onRecord(task, completion, note)
    setToast({ headline, body })
    timeoutRef.current = window.setTimeout(() => setToast(null), TOAST_MS)
  }

  function handleDone(task: ProtocolTask) {
    const headline = task.points > 0 ? `+${task.points} pts` : 'Logged.'
    showToastThenAdvance(headline, task.evidenceText, task, 'completed')
  }

  function handleHonestMiss(task: ProtocolTask) {
    showToastThenAdvance(
      'Logged honestly.',
      'The score can recover. Self-deception is the real loss.',
      task,
      'missed',
    )
  }

  function handleReflectionContinue(task: ProtocolTask) {
    const text = reflectionText.trim()
    setReflectionText('')
    if (!text) {
      onRecord(task, 'skipped')
      return
    }
    showToastThenAdvance('Noted.', undefined, task, 'completed', text)
  }

  if (toast) {
    return (
      <div className="protocol-screen">
        <div className="toast-card">
          <p className="toast-headline">{toast.headline}</p>
          {toast.body && <p className="toast-body">{toast.body}</p>}
        </div>
      </div>
    )
  }

  if (!currentTask) {
    return (
      <div className="protocol-screen">
        <section className="protocol-clear-card">
          <p className="eyebrow">Protocol</p>
          <p className="mission-name">🥷 Protocol clear. Go be dangerous.</p>
          <p className="mission-description">
            {doneCount} of {scheduled.length} logged today.
          </p>
        </section>
      </div>
    )
  }

  const isMilestone = currentTask.points === 0 && !currentTask.required && currentTask.category !== 'reflection'

  return (
    <div className="protocol-screen">
      <div className="progress-track" role="progressbar" aria-valuenow={doneCount} aria-valuemin={0} aria-valuemax={scheduled.length}>
        <div className="progress-fill" style={{ width: `${scheduled.length ? (doneCount / scheduled.length) * 100 : 0}%` }} />
      </div>
      <p className="protocol-progress-label">
        {doneCount} / {scheduled.length} today
      </p>

      <section className={`mission-card${isMilestone ? ' mission-card--milestone' : ''}`}>
        <p className="mission-category">{CATEGORY_LABEL[currentTask.category]}</p>
        <p className="mission-name">
          <span aria-hidden="true">{currentTask.icon}</span> {currentTask.name}
        </p>
        {currentTask.description && <p className="mission-description">{currentTask.description}</p>}

        {currentTask.category === 'reflection' ? (
          <div className="reflection-controls">
            <textarea
              className="reflection-input"
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="Optional — write as much or as little as you want."
              rows={3}
            />
            <button type="button" className="btn-primary" onClick={() => handleReflectionContinue(currentTask)}>
              Continue
            </button>
          </div>
        ) : isMilestone ? (
          <button type="button" className="btn-primary" onClick={() => handleDone(currentTask)}>
            Continue
          </button>
        ) : (
          <div className="task-controls">
            <button type="button" className="btn-primary" onClick={() => handleDone(currentTask)}>
              ✅ Done
            </button>
            {currentTask.required && (
              <button type="button" className="btn-ghost" onClick={() => handleHonestMiss(currentTask)}>
                Didn't happen — log it
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
