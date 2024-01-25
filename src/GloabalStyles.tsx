// GlobalStyles.ts
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: "ChosunBg";
    src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/ChosunBg.woff") format("woff");
    font-weight: normal;
    font-style: normal;
  }

  body {
    font-family: "ChosunBg", sans-serif;
  }
`;

