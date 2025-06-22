import './index.css';

export function DescriptionList(props: React.ComponentProps<'dl'>) {
  return <dl {...props} />;
}

export function DescriptionListItem({
  label,
  value,
}: Readonly<{ label: string; value: React.ReactNode }>) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </>
  );
}
