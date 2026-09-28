// Shared scoring logic: how weak a topic is, how urgent the exam is,
// and the resulting priority used to rank what to study next.

export function scoreTone(score) {
  if (score < 50) return 'red'
  if (score < 75) return 'amber'
  return 'green'
}

export function scoreLabel(score) {
  if (score < 50) return 'Weak'
  if (score < 75) return 'Building'
  return 'Solid'
}

export function daysUntil(dateStr) {
  if (!dateStr) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(dateStr + 'T00:00:00')
  return Math.ceil((d - today) / 86400000)
}

// 1x pressure a month out, scaling up to 3x the day of the exam.
export function urgencyFactor(daysLeft) {
  if (daysLeft == null) return 1
  if (daysLeft <= 0) return 3
  if (daysLeft >= 30) return 1
  return 1 + (2 * (30 - daysLeft)) / 30
}

export function priorityScore(knowledgeScore, daysLeft) {
  const weakness = 100 - knowledgeScore
  return weakness * urgencyFactor(daysLeft)
}

// Split a fixed time budget across ranked items, weighted by priority,
// with a sensible floor/ceiling per topic.
export function allocateMinutes(items, totalMinutes) {
  const totalWeight = items.reduce((sum, i) => sum + i.priority, 0) || 1
  const raw = items.map((i) => (i.priority / totalWeight) * totalMinutes)
  return raw.map((m) => Math.max(10, Math.round(m / 5) * 5))
}
