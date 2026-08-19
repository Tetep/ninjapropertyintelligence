import type { DayProgress } from '../lib/today'

const WEEKDAY_LETTER = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

interface WeekMeterProps {
  days: DayProgress[]
}

function cellClass(day: DayProgress): string {
  if (day.ratio === null) return 'week-cell week-cell--empty'
  if (day.ratio >= 0.8) return 'week-cell week-cell--high'
  if (day.ratio >= 0.4) return 'week-cell week-cell--mid'
  if (day.ratio > 0) return 'week-cell week-cell--low'
  return 'week-cell week-cell--zero'
}

export function WeekMeter({ days }: WeekMeterProps) {
  return (
    <section className="week-meter">
      <p className="eyebrow">Last 7 Days</p>
      <div className="week-meter__row">
        {days.map((day) => (
          <div key={day.date} className="week-meter__col" title={`${day.date}: ${day.earned}/${day.max}`}>
            <div className={cellClass(day) + (day.isToday ? ' week-cell--today' : '')} />
            <span className="week-meter__label">{WEEKDAY_LETTER[day.weekday]}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
