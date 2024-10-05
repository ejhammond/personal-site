export default function debounce(fn: (...args: any[]) => any, ms: number) {
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
