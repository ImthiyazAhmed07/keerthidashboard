export function getGreeting(name: string = 'Keerthika'): { greeting: string; period: 'morning' | 'afternoon' | 'evening' | 'night' } {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return { greeting: `Good morning, ${name} 🌻`, period: 'morning' };
  } else if (hour >= 12 && hour < 17) {
    return { greeting: `Good afternoon, ${name} 🌻`, period: 'afternoon' };
  } else if (hour >= 17 && hour < 22) {
    return { greeting: `Good evening, ${name} 🌻`, period: 'evening' };
  } else {
    return { greeting: `Good night, ${name} 🌻`, period: 'night' };
  }
}

export function formatFullDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime(date: Date = new Date()): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function getDaysRemaining(targetDateStr: string): {
  days: number;
  label: string;
  isToday: boolean;
  isPast: boolean;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(targetDateStr);
  target.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - today.getTime();
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return { days: 0, label: 'Today 🎉', isToday: true, isPast: false };
  } else if (days === 1) {
    return { days: 1, label: 'Tomorrow', isToday: false, isPast: false };
  } else if (days > 1) {
    return { days, label: `In ${days} days`, isToday: false, isPast: false };
  } else if (days === -1) {
    return { days, label: 'Yesterday', isToday: false, isPast: true };
  } else {
    return { days, label: `${Math.abs(days)} days ago`, isToday: false, isPast: true };
  }
}

export function formatRelativeTime(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
