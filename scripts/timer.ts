#!/usr/bin/env ts-node

let start: [number, number] | undefined;

export function startTimer(): void {
  start = process.hrtime();
}

export function readTimer(): string {
  if (start == null) {
    throw new Error('Timer has not been started. Call startTimer() first.');
  }

  const elapsedMS = process.hrtime(start)[1] / 1000000;
  return elapsedMS.toFixed(3);
}
