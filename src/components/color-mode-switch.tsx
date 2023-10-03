type Props = Readonly<{
  lightContent: React.ReactNode;
  darkContent: React.ReactNode;
}>;

export function ColorModeSwitch({ lightContent, darkContent }: Props) {
  return (
    <>
      <div data-colormode="light">{lightContent}</div>
      <div data-colormode="dark">{darkContent}</div>
    </>
  );
}
