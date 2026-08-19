import type { Belief, Level, ProtocolTask, User } from '../types/models'
import type { DayProgress, TodayScoreSummary } from '../lib/today'
import { getMood } from '../lib/today'
import { NinjaAvatar } from './NinjaAvatar'
import { WeekMeter } from './WeekMeter'

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
  weekProgress: DayProgress[]
  onGoToProtocol: () => void
}

/**
 * Hierarchy, deliberately: hero (who you are + how you're doing) → the one
 * decision that matters right now → everything else, smaller. Previously
 * six equal-weight full cards read as a wall — this makes "what do I do"
 * the thing your eye lands on, per section 11's four questions in that
 * priority order.
 */
export function TodayScreen({
  user,
  beliefs,
  currentLevel,
  nextLevel,
  score,
  nextMission,
  weekProgress,
  onGoToProtocol,
}: TodayScreenProps) {
  const xpIntoLevel = user.lifetimeXp - currentLevel.xpRequired
  const xpForLevel = nextLevel ? nextLevel.xpRequired - currentLevel.xpRequired : null
  const levelProgress = xpForLevel ? Math.min(100, Math.round((xpIntoLevel / xpForLevel) * 100)) : 100
  const mood = getMood(weekProgress)

  return (
    <div className="today-screen">
      <section className="hero-card">
        <NinjaAvatar mood={mood} size={92} />
        <div className="hero-card__info">
          <p className="eyebrow">Current Rank</p>
          <p className="rank-title">{currentLevel.title}</p>
          <div className="xp-row">
            <span>{user.lifetimeXp} XP</span>
            {nextLevel && <span>{nextLevel.title} at {nextLevel.xpRequired}</span>}
          </div>
          {xpForLevel !== null && (
            <div className="progress-track" role="progressbar" aria-valuenow={levelProgress} aria-valuemin={0} aria-valuemax={100}>
              <div className="progress-fill" style={{ width: `${levelProgress}%` }} />
            </div>
          )}
        </div>
        <div className="hero-card__score">
          <span className="hero-card__score-value">{score.earned}</span>
          <span className="hero-card__score-max">/{score.max}</span>
          <span className="eyebrow">Today's Mark</span>
        </div>
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

      <div className="today-secondary">
        <section className="identity-card identity-card--compact">
          <p className="eyebrow">Who am I becoming</p>
          <p className="identity-statement">"{user.identityStatement}"</p>
        </section>

        <WeekMeter days={weekProgress} />

        <section className="beliefs-card">
          <p className="eyebrow">Standing Beliefs</p>
          <ol className="beliefs-list">
            {beliefs.map((b) => (
              <li key={b.id}>{b.belief}</li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}
