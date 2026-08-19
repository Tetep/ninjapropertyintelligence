import { useMemo, useState } from 'react'
import './App.css'
import { NavShell } from './components/NavShell'
import { TodayScreen } from './components/TodayScreen'
import { store } from './lib/storage'
import { getCurrentLevel, getNextLevel, getNextMission, getTodayScore } from './lib/today'
import type { Belief, DailyRecord, Level, ProtocolTask, User } from './types/models'

interface AppData {
  user: User
  beliefs: Belief[]
  levels: Level[]
  tasks: ProtocolTask[]
  records: DailyRecord[]
}

/**
 * localStorage reads are synchronous, so there's no real async loading
 * step here — initializing state lazily (rather than via a mount effect)
 * avoids an unnecessary extra render and a "loading" flash.
 */
function loadAppData(): AppData {
  store.init()
  return {
    user: store.getUser(),
    beliefs: store.getBeliefs(),
    levels: store.getLevels(),
    tasks: store.getProtocolTasks(),
    records: store.getDailyRecords(),
  }
}

function App() {
  const [{ user, beliefs, levels, tasks, records }] = useState(loadAppData)

  const currentLevel = useMemo(() => getCurrentLevel(levels, user.lifetimeXp), [levels, user])
  const nextLevel = useMemo(() => getNextLevel(levels, currentLevel), [levels, currentLevel])
  const score = useMemo(() => getTodayScore(tasks, records), [tasks, records])
  const nextMission = useMemo(() => getNextMission(tasks, records), [tasks, records])

  return (
    <div className="app-shell">
      <main className="app-content">
        <TodayScreen
          user={user}
          beliefs={beliefs}
          currentLevel={currentLevel}
          nextLevel={nextLevel}
          score={score}
          nextMission={nextMission}
        />
      </main>
      <NavShell active="today" />
    </div>
  )
}

export default App
