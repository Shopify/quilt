export function initTimer() {
  const startTime = process.hrtime();

  function stop() {
    const duration = process.hrtime(startTime);
    const [seconds, nanoseconds] = duration;
    const milliseconds = seconds * 1000 + nanoseconds / 1e6;
    return Math.round(milliseconds);
  }

  return {stop};
}

export interface Timer {
  stop(): number;
}
