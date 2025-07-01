// Format time as MM:SS
export const formatTime = (seconds: number): string => {
  if (seconds < 0) {
    return '00:00';
  }

  const mins = Math.floor(parseInt(seconds.toString()) / 60);
  const secs = parseInt(seconds.toString()) % 60;
  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
};
