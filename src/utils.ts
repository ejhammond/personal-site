function capitalizeWord(w: string) {
  return `${w.slice(0, 1).toUpperCase()}${w.slice(1)}`;
}

export function makeHeading(str: string) {
  return str.split('-').map(capitalizeWord).join(' ');
}
