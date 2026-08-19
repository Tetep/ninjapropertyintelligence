import { useState } from 'react'
import type { IdentityAnswers } from '../types/models'

interface Step {
  key: keyof Omit<IdentityAnswers, 'updatedAt'>
  eyebrow: string
  prompt: string
  placeholder: string
}

const STEPS: Step[] = [
  {
    key: 'currentIdentity',
    eyebrow: 'Identity — Step 1 of 4',
    prompt: 'Who are you right now?',
    placeholder: 'No performance. What\'s actually true about you today?',
  },
  {
    key: 'currentPatterns',
    eyebrow: 'Identity — Step 2 of 4',
    prompt: 'What patterns keep showing up?',
    placeholder: "What do you keep doing that isn't who you want to be?",
  },
  {
    key: 'targetIdentity',
    eyebrow: 'The Shift — Step 3 of 4',
    prompt: 'Who are you becoming?',
    placeholder: 'If discipline stopped being a struggle, who would you be in a year?',
  },
  {
    key: 'targetStandards',
    eyebrow: 'The Shift — Step 4 of 4',
    prompt: 'What would that person do — consistently — that you don\'t do yet?',
    placeholder: 'Standards, not goals. What would they actually do, every day?',
  },
]

function asSentence(text: string): string {
  return text.endsWith('.') || text.endsWith('!') || text.endsWith('?') ? text : `${text}.`
}

/**
 * Deliberately doesn't try to grammatically merge the two answers into one
 * sentence — stitching arbitrary user phrasing into "I prove it by [verb]"
 * breaks tense agreement more often than not. Two plain sentences instead.
 */
function composeDraft(a: Omit<IdentityAnswers, 'updatedAt'>, fallback: string): string {
  const target = a.targetIdentity.trim()
  const standards = a.targetStandards.trim()
  if (!target) return fallback
  const capitalized = /^i am\b/i.test(target) ? target : `I am ${target}`
  const sentence1 = asSentence(capitalized)
  if (!standards) return sentence1
  return `${sentence1} That looks like: ${asSentence(standards)}`
}

interface IdentityWizardProps {
  initialAnswers: IdentityAnswers | null
  currentStatement: string
  onSave: (answers: IdentityAnswers, statement: string) => void
  onCancel: () => void
}

export function IdentityWizard({ initialAnswers, currentStatement, onSave, onCancel }: IdentityWizardProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<Omit<IdentityAnswers, 'updatedAt'>>({
    currentIdentity: initialAnswers?.currentIdentity ?? '',
    currentPatterns: initialAnswers?.currentPatterns ?? '',
    targetIdentity: initialAnswers?.targetIdentity ?? '',
    targetStandards: initialAnswers?.targetStandards ?? '',
  })
  const [draft, setDraft] = useState<string | null>(null)

  const onReview = stepIndex === STEPS.length

  function setField(key: Step['key'], value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  function goNext() {
    if (stepIndex === STEPS.length - 1) {
      setDraft(composeDraft(answers, currentStatement))
    }
    setStepIndex((i) => i + 1)
  }

  function goBack() {
    setStepIndex((i) => Math.max(0, i - 1))
  }

  function handleSave() {
    onSave({ ...answers, updatedAt: new Date().toISOString() }, (draft ?? currentStatement).trim())
  }

  if (onReview) {
    return (
      <div className="wizard">
        <p className="eyebrow">Review</p>
        <p className="mission-name">Your identity statement</p>
        <p className="mission-description">
          Drafted from what you wrote. Edit it until it's actually true and actually you.
        </p>
        <textarea
          className="reflection-input wizard-draft"
          value={draft ?? ''}
          onChange={(e) => setDraft(e.target.value)}
          rows={5}
        />
        <div className="task-controls">
          <button type="button" className="btn-primary" onClick={handleSave}>
            Save identity statement
          </button>
          <button type="button" className="btn-ghost" onClick={goBack}>
            Back
          </button>
          <button type="button" className="btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    )
  }

  const step = STEPS[stepIndex]

  return (
    <div className="wizard">
      <p className="eyebrow">{step.eyebrow}</p>
      <p className="mission-name">{step.prompt}</p>
      <textarea
        className="reflection-input wizard-input"
        value={answers[step.key]}
        onChange={(e) => setField(step.key, e.target.value)}
        placeholder={step.placeholder}
        rows={5}
        autoFocus
      />
      <div className="task-controls">
        <button type="button" className="btn-primary" onClick={goNext}>
          {stepIndex === STEPS.length - 1 ? 'Review' : 'Next'}
        </button>
        {stepIndex > 0 && (
          <button type="button" className="btn-ghost" onClick={goBack}>
            Back
          </button>
        )}
        <button type="button" className="btn-ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  )
}
