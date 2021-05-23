import { AspectRatio } from '@theme-ui/components';
import * as React from 'react';

export function YouTubeVideo({ id, start, end }: {id: string, start?: number, end?: number }) {
  return (
    <AspectRatio ratio={16/9}>
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0${start !== undefined ? `&start=${start}` : ''}${end !== undefined ? `&end=${end}` : ''}`}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </AspectRatio>
  )
}
