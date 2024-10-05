export default function debounce(
  fn: (...args: unknown[]) => unknown,
  ms: number,
) {
  let timerID: NodeJS.Timeout;

  return () => {
    if (timerID != null) {
      clearTimeout(timerID);
    }

    timerID = setTimeout(() => {
      fn();
    }, ms);
  };
}
