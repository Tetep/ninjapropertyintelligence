import { useMemo, useState } from 'react'
import './App.css'
import { NavShell, type ScreenId } from './components/NavShell'
import { ProtocolScreen } from './components/ProtocolScreen'
import { SettingsScreen } from './components/SettingsScreen'
import { TodayScreen } from './components/TodayScreen'
import { buildDailyRecord, upsertRecord } from './lib/records'
import { store } from './lib/storage'
import { getCurrentLevel, getNextLevel, getNextMission, getTodayScore, getWeekProgress } from './lib/today'
import type { Belief, DailyRecord, IdentityAnswers, Level, ProtocolTask, User } from './types/models'

interface AppData {
  user: User
  beliefs: Belief[]
  levels: Level[]
  tasks: ProtocolTask[]
  records: DailyRecord[]
  identityAnswers: IdentityAnswers | null
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
    identityAnswers: store.getIdentityAnswers(),
  }
}

function App() {
  const [data, setData] = useState(loadAppData)
  const { user, beliefs, levels, tasks, records, identityAnswers } = data
  const [screen, setScreen] = useState<ScreenId>('today')

  const currentLevel = useMemo(() => getCurrentLevel(levels, user.lifetimeXp), [levels, user])
  const nextLevel = useMemo(() => getNextLevel(levels, currentLevel), [levels, currentLevel])
  const score = useMemo(() => getTodayScore(tasks, records), [tasks, records])
  const nextMission = useMemo(() => getNextMission(tasks, records), [tasks, records])
  const weekProgress = useMemo(() => getWeekProgress(tasks, records), [tasks, records])

  function handleRecord(task: ProtocolTask, completion: DailyRecord['completion'], note?: string) {
    const record = buildDailyRecord(task, completion, new Date(), note)
    setData((prev) => {
      const next = upsertRecord(prev.records, record)
      store.saveDailyRecords(next)
      return { ...prev, records: next }
    })
  }

  function handleSaveIdentity(answers: IdentityAnswers, statement: string) {
    setData((prev) => {
      const nextUser = { ...prev.user, identityStatement: statement }
      store.saveUser(nextUser)
      store.saveIdentityAnswers(answers)
      return { ...prev, user: nextUser, identityAnswers: answers }
    })
  }

  function handleSaveMissions(names: Record<string, string>) {
    setData((prev) => {
      const nextTasks = prev.tasks.map((t) => (names[t.id] ? { ...t, name: names[t.id] } : t))
      store.saveProtocolTasks(nextTasks)
      return { ...prev, tasks: nextTasks }
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
            weekProgress={weekProgress}
            onGoToProtocol={() => setScreen('protocol')}
          />
        )}
        {screen === 'protocol' && (
          <ProtocolScreen tasks={tasks} records={records} onRecord={handleRecord} />
        )}
        {screen === 'settings' && (
          <SettingsScreen
            user={user}
            identityAnswers={identityAnswers}
            tasks={tasks}
            onSaveIdentity={handleSaveIdentity}
            onSaveMissions={handleSaveMissions}
          />
        )}
      </main>
      <NavShell active={screen} onNavigate={setScreen} />
    </div>
  )
}

export default App
