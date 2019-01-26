// eslint-disable-next-line import/prefer-default-export
export function formatReadingTime(minutes: number): string {
  const cups = Math.round(minutes / 5);
  return `${new Array(cups || 1).fill('☕️').join('')} ${minutes} min read`;
}
