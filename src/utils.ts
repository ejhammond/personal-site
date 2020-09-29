function capitalizeWord(w) {
  return `${w.slice(0, 1).toUpperCase()}${w.slice(1)}`;
}

export function makeHeading(str) {
  return str.split('-').map(capitalizeWord).join(' ');
}
