export default function cx(
  ...classNames: Array<string | null | undefined | false>
): string {
  return classNames.filter(Boolean).join(' ');
}
