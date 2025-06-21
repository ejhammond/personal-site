export function isNonEmptyNode(node: React.ReactNode) {
  return node != null && typeof node !== 'boolean';
}
