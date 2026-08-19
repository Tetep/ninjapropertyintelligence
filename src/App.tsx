import { useMemo, useState } from 'react'
import './App.css'
import { NavShell, type ScreenId } from './components/NavShell'
import { ProtocolScreen } from './components/ProtocolScreen'
import { TodayScreen } from './components/TodayScreen'
import { buildDailyRecord, upsertRecord } from './lib/records'
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
  const [data, setData] = useState(loadAppData)
  const { user, beliefs, levels, tasks, records } = data
  const [screen, setScreen] = useState<ScreenId>('today')

  const currentLevel = useMemo(() => getCurrentLevel(levels, user.lifetimeXp), [levels, user])
  const nextLevel = useMemo(() => getNextLevel(levels, currentLevel), [levels, currentLevel])
  const score = useMemo(() => getTodayScore(tasks, records), [tasks, records])
  const nextMission = useMemo(() => getNextMission(tasks, records), [tasks, records])

  function handleRecord(task: ProtocolTask, completion: DailyRecord['completion'], note?: string) {
    const record = buildDailyRecord(task, completion, new Date(), note)
    setData((prev) => {
      const next = upsertRecord(prev.records, record)
      store.saveDailyRecords(next)
      return { ...prev, records: next }
    })
  }

  return (
    <div className="app-shell">
      <main className="app-content">
        {screen === 'today' && (
          <TodayScreen
            user={user}
            beliefs={beliefs}
            currentLevel={currentLevel}
            nextLevel={nextLevel}
            score={score}
            nextMission={nextMission}
            onGoToProtocol={() => setScreen('protocol')}
          />
        )}
        {screen === 'protocol' && (
          <ProtocolScreen tasks={tasks} records={records} onRecord={handleRecord} />
        )}
      </main>
      <NavShell active={screen} onNavigate={setScreen} />
    </div>
  )
}

export default App
