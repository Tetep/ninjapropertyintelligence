export type ScreenId = 'today' | 'protocol' | 'character' | 'history' | 'settings'

const TABS: { id: ScreenId; label: string; icon: string; enabled: boolean }[] = [
  { id: 'today', label: 'Today', icon: '🏠', enabled: true },
  { id: 'protocol', label: 'Protocol', icon: '📋', enabled: false },
  { id: 'character', label: 'Character', icon: '🥷', enabled: false },
  { id: 'history', label: 'History', icon: '📈', enabled: false },
  { id: 'settings', label: 'Settings', icon: '⚙️', enabled: false },
]

interface NavShellProps {
  active: ScreenId
}

/**
 * Static placeholder nav for the five MVP screens (section 33). Only
 * "Today" is wired up in Phase 1 — the rest render as disabled tabs so
 * the intended app shape is visible without building ahead of the
 * approved phase.
 */
export function NavShell({ active }: NavShellProps) {
  return (
    <nav className="nav-shell" aria-label="Screens">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`nav-tab${tab.id === active ? ' nav-tab--active' : ''}`}
          disabled={!tab.enabled}
          title={tab.enabled ? tab.label : `${tab.label} — coming soon`}
        >
          <span aria-hidden="true">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
