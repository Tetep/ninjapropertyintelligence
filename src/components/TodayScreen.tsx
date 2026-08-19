import type { Belief, Level, ProtocolTask, User } from '../types/models'
import type { TodayScoreSummary } from '../lib/today'

const CATEGORY_LABEL: Record<ProtocolTask['category'], string> = {
  night_prep: 'Night Prep',
  morning: 'Morning Protocol',
  gym: 'Training',
  transition: 'Transition',
  entrepreneur: 'Entrepreneur Mode',
  substance: 'Clear Mind',
  reflection: 'Reflection',
}

interface TodayScreenProps {
  user: User
  beliefs: Belief[]
  currentLevel: Level
  nextLevel: Level | null
  score: TodayScoreSummary
  nextMission: ProtocolTask | null
  onGoToProtocol: () => void
}

export function TodayScreen({
  user,
  beliefs,
  currentLevel,
  nextLevel,
  score,
  nextMission,
  onGoToProtocol,
}: TodayScreenProps) {
  const xpIntoLevel = user.lifetimeXp - currentLevel.xpRequired
  const xpForLevel = nextLevel ? nextLevel.xpRequired - currentLevel.xpRequired : null
  const levelProgress = xpForLevel ? Math.min(100, Math.round((xpIntoLevel / xpForLevel) * 100)) : 100

  return (
    <div className="today-screen">
      <section className="identity-card">
        <p className="eyebrow">Who am I becoming</p>
        <p className="identity-statement">"{user.identityStatement}"</p>
      </section>

      <section className="rank-card">
        <div className="rank-card__top">
          <div>
            <p className="eyebrow">Current Rank</p>
            <p className="rank-title">{currentLevel.title}</p>
          </div>
          <div className="rank-avatar" aria-hidden="true">
            🥷
          </div>
        </div>
        <div className="xp-row">
          <span>{user.lifetimeXp} lifetime XP</span>
          {nextLevel && <span>{nextLevel.title} at {nextLevel.xpRequired}</span>}
        </div>
        {xpForLevel !== null && (
          <div className="progress-track" role="progressbar" aria-valuenow={levelProgress} aria-valuemin={0} aria-valuemax={100}>
            <div className="progress-fill" style={{ width: `${levelProgress}%` }} />
          </div>
        )}
      </section>

      <section className="score-card">
        <p className="eyebrow">Today's Mark</p>
        <p className="score-value">
          {score.earned} <span className="score-max">/ {score.max}</span>
        </p>
      </section>

      <section className="mission-card">
        <p className="eyebrow">Next Move</p>
        {nextMission ? (
          <>
            <p className="mission-category">{CATEGORY_LABEL[nextMission.category]}</p>
            <p className="mission-name">
              <span aria-hidden="true">{nextMission.icon}</span> {nextMission.name}
            </p>
            {nextMission.description && (
              <p className="mission-description">{nextMission.description}</p>
            )}
            <button type="button" className="btn-primary mission-cta" onClick={onGoToProtocol}>
              Go do it
            </button>
          </>
        ) : (
          <p className="mission-name">🎉 Protocol clear for today. Nothing waiting on you.</p>
        )}
      </section>

      <section className="beliefs-card">
        <p className="eyebrow">Standing Beliefs</p>
        <ol className="beliefs-list">
          {beliefs.map((b) => (
            <li key={b.id}>{b.belief}</li>
          ))}
        </ol>
      </section>
    </div>
  )
}
