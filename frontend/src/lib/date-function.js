export function getCountdown(targetDate) {
  const now = new Date()
  const targets = new Date(targetDate)
  let diff = Math.max(0, targets - now)

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  diff %= (1000 * 60 * 60 * 24)
  const hours = Math.floor(diff / (1000 * 60 * 60))
  diff %= (1000 * 60 * 60)
  const minutes = Math.floor(diff / (1000 * 60))
  diff %= (1000 * 60)
  const seconds = Math.floor(diff / 1000)

  let parts = []
  if (days > 0) parts.push(`${days} days`)
  if (hours > 0) parts.push(`${hours} hours`)
  if (minutes > 0) parts.push(`${minutes} minutes`)
  if (seconds > 0) parts.push(`${seconds} seconds`)

  return parts.length > 0 ? parts.join(", ") + " remaining" : "Time's up"
}

export function timeAgo(date) {
  const now = new Date()
  const targets = new Date(date)
  const diff = Math.floor((now - targets) / 1000)

  if (diff < 60) return `${diff} seconds ago`
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`
  if (diff < 2592000) return `${Math.floor(diff / 604800)} weeks ago`
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`
  return `${Math.floor(diff / 31536000)} years ago`
}

export function formatDate(dateprm) {
  const date = new Date(dateprm)
  const hari = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ]
  const bulan = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  const dayName = hari[date.getDay()]
  const day = date.getDate()
  const monthName = bulan[date.getMonth()]
  const year = date.getFullYear()
  return `${dayName}, ${monthName} ${day}, ${year}`
}