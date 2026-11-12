export function Arrow({ direction = 'diagonal' }: { direction?: 'diagonal' | 'right' | 'down' }) {
  const rotation = direction === 'right' ? 45 : direction === 'down' ? 135 : 0;
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transform: `rotate(${rotation}deg)` }}><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
