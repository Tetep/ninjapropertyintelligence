import { useState } from 'react'
import type { IdentityAnswers, ProtocolTask, User } from '../types/models'
import { IdentityWizard } from './IdentityWizard'

const MISSION_IDS = ['mission-1', 'mission-2', 'mission-3']

interface SettingsScreenProps {
  user: User
  identityAnswers: IdentityAnswers | null
  tasks: ProtocolTask[]
  onSaveIdentity: (answers: IdentityAnswers, statement: string) => void
  onSaveMissions: (names: Record<string, string>) => void
}

export function SettingsScreen({ user, identityAnswers, tasks, onSaveIdentity, onSaveMissions }: SettingsScreenProps) {
  const [showWizard, setShowWizard] = useState(false)
  const missionTasks = MISSION_IDS.map((id) => tasks.find((t) => t.id === id)).filter(
    (t): t is ProtocolTask => !!t,
  )
  const [missionNames, setMissionNames] = useState<Record<string, string>>(
    Object.fromEntries(missionTasks.map((t) => [t.id, t.name])),
  )
  const [missionsSaved, setMissionsSaved] = useState(false)

  if (showWizard) {
    return (
      <IdentityWizard
        initialAnswers={identityAnswers}
        currentStatement={user.identityStatement}
        onSave={(answers, statement) => {
          onSaveIdentity(answers, statement)
          setShowWizard(false)
        }}
        onCancel={() => setShowWizard(false)}
      />
    )
  }

  function handleSaveMissions() {
    onSaveMissions(missionNames)
    setMissionsSaved(true)
    window.setTimeout(() => setMissionsSaved(false), 1500)
  }

  return (
    <div className="settings-screen">
      <section className="identity-card">
        <p className="eyebrow">Who am I becoming</p>
        <p className="identity-statement">"{user.identityStatement}"</p>
        <button type="button" className="btn-ghost settings-edit-btn" onClick={() => setShowWizard(true)}>
          Redefine your identity
        </button>
      </section>

      <section className="missions-card">
        <p className="eyebrow">Today's 3 Missions</p>
        <p className="mission-description">
          Your standard is "revenue-producing work consistently" — these are that, made specific.
        </p>
        <div className="missions-list">
          {missionTasks.map((task, i) => (
            <input
              key={task.id}
              className="mission-input"
              value={missionNames[task.id] ?? ''}
              onChange={(e) => setMissionNames((prev) => ({ ...prev, [task.id]: e.target.value }))}
              placeholder={`Mission ${i + 1}`}
            />
          ))}
        </div>
        <button type="button" className="btn-primary" onClick={handleSaveMissions}>
          {missionsSaved ? 'Saved.' : 'Save missions'}
        </button>
      </section>

      <section className="settings-future-card">
        <p className="eyebrow">Coming later</p>
        <p className="mission-description">
          Editable habits, point weights, and schedules land in a future phase.
        </p>
      </section>
    </div>
  )
}
