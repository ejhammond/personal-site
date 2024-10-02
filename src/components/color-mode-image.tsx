import Image, { ImageProps } from 'next/image';

type Props = Readonly<{
  srcDark: ImageProps['src'];
  srcLight: ImageProps['src'];
  alt: string;
}> &
  Omit<ImageProps, 'src'>;

export function ColorModeImage({
  srcDark,
  srcLight,
  alt,
  ...delegated
}: Props) {
  return (
    <>
      <Image {...delegated} data-colormode="light" src={srcLight} alt={alt} />
      <Image {...delegated} data-colormode="dark" src={srcDark} alt={alt} />
    </>
  );
}
