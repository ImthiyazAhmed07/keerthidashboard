import confetti from 'canvas-confetti';

export function fireSunflowerConfetti() {
  try {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#F59E0B', '#FBBF24', '#D97706', '#FCD34D', '#10B981'],
      ticks: 200,
      gravity: 1.2,
      scalar: 0.9,
    });
  } catch {}
}
