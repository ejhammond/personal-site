import Image, { ImageProps } from 'next/image';

type Props = Readonly<{
  srcDark: ImageProps['src'];
  srcLight: ImageProps['src'];
}> &
  Omit<ImageProps, 'src'>;

export function ColorModeImage({ srcDark, srcLight, ...delegated }: Props) {
  return (
    <>
      <Image {...delegated} data-colormode="light" src={srcLight} />
      <Image {...delegated} data-colormode="dark" src={srcDark} />
    </>
  );
}
