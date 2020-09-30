import { lighten } from '@theme-ui/color';
import { Theme } from 'theme-ui';

const theme: Theme = {
  colors: {
    primary: '#385170',
    secondary: '#1CA086',
    accent: '#1CA086',
    gray: '#666666',
    text: '#333333',
    background: '#FFFFFF',
    danger: '#F44336',
  },
  fonts: {
    body: 'Montserrat, sans-serif',
    heading: 'Montserrat, sans-serif',
    monospace: 'Inconsolata, monospace',
  },
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.25,
  },
  fontSizes: [14, 16, 20, 24, 32, 48, 64, 96],
  messages: {
    error: {
      backgroundColor: lighten('danger', 0.32),
      borderLeftColor: 'danger',
    },
  },
  styles: {
    root: {
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
      fontSize: 1,
    },
    a: {
      color: 'accent',
      textDecoration: 'none',
      ':hover': {
        color: lighten('accent', 0.1),
      },
    },
    blockquote: {
      ml: 0,
      pl: 3,
      borderLeftWidth: '8px',
      borderLeftStyle: 'solid',
      borderLeftColor: 'accent',
      fontStyle: 'italic',
    },
    code: {
      padding: 3,
      overflow: 'auto',
      color: '#d6deeb',
      backgroundColor: '#001628',
      '.changed': { color: 'rgb(162, 191, 252)', fontStyle: 'italic' },
      '.deleted': { color: 'rgba(239, 83, 80, 0.56)', fontStyle: 'italic' },
      '.tag': { color: '#5BDECA' },
      '.operator,.keyword': { color: '#D18DF0' },
      '.inserted,.attr-name': { color: 'rgb(173, 219, 103)', fontStyle: 'italic' },
      '.comment': { color: 'rgb(99, 119, 119)', fontStyle: 'italic' },
      '.string,.attr-value': { color: '#FFCA80' },
      '.url': { color: 'rgb(173, 219, 103)' },
      '.variable': { color: 'rgb(214, 222, 235)' },
      '.number': { color: 'rgb(247, 140, 108)' },
      '.builtin,.char,.constant,.function': { color: '#79AAFF' },
      '.punctuation,.tag.punctuation': { color: 'rgb(199, 146, 234)' },
      '.selector,.doctype': { color: 'rgb(199, 146, 234)', fontStyle: 'italic' },
      '.class-name': { color: 'rgb(255, 203, 139)' },
      '.boolean': { color: 'rgb(255, 88, 116)' },
      '.property': { color: 'rgb(128, 203, 196)' },
      '.namespace': { color: 'rgb(178, 204, 214)' },
      '.highlight': { background: 'hsla(0, 0%, 30%, .5)' },
    },
    inlineCode: {
      fontFamily: 'monospace',
      whiteSpace: 'nowrap',
      padding: '2px 5px',
      backgroundColor: lighten('secondary', 0.56),
    },
  },
};

export default theme;

// const o = {
//   // Blockquote styles.
//   blockquote: {
//     ...scale(1 / 5),
//     borderLeft: `${rhythm(6 / 16)} solid ${secondary}`,
//     color: textMuted,
//     paddingLeft: rhythm(10 / 16),
//     fontFamily: `${emphasizedFontFamily}, ${baseFontFamily}`,
//     fontStyle: 'italic',
//     fontSize: '1.14em', // bump up size to match body font
//     marginLeft: 0,
//     marginRight: 0,
//   },
//   'blockquote > :last-child': {
//     marginBottom: 0,
//   },
//   'blockquote cite': {
//     ...adjustFontSizeTo(options.baseFontSize),
//     color: options.bodyColor,
//     fontStyle: 'normal',
//     fontWeight: options.bodyWeight,
//   },
//   'blockquote cite:before': {
//     content: '"— "',
//   },
//   code: {
//     fontFamily: `${codeFontFamily}, monospace`,
//     border: `1px solid ${border}`,
//     padding: '2px 5px',
//     borderRadius: '4px',
//     fontSize: '1em',
//     whiteSpace: 'nowrap',
//   },
//   '.gatsby-highlight code': {
//     // undo all of the fancy `code` styles if we're inside of .gatsby-highlight
//     border: 'none',
//     padding: 0,
//     borderRadius: 'unset',
//   },
//   '.gatsby-highlight': {
//     marginBottom: '32px',
//   },
//   em: {
//     fontFamily: `${emphasizedFontFamily}, ${baseFontFamily}`,
//     fontSize: '1.14em', // bump up size to match body font
//   },
//   [MOBILE_MEDIA_QUERY]: {
//     html: {
//       ...vr.establishBaseline(),
//     },
//   },
// };
