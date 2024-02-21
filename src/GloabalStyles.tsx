import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: "ChosunBg";
    src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/ChosunBg.woff") format("woff");
    font-weight: normal;
    font-style: normal;
    // font-family: 'ChosunBg', sans-serif;
  }

  @font-face {
    font-family: 'JalnanGothic';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_231029@1.1/JalnanGothic.woff') format('woff');
    font-weight: normal;
    font-style: normal;
    //  font-family: 'JalnanGothic', sans-serif;
  }

  @font-face {
    font-family: 'MaplestoryOTFBold';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@2.1/MaplestoryOTFBold.woff') format('woff');
    font-weight: normal;
    font-style: normal;
  }

  @font-face{
    font-family:'DNFBitBitv2';
    font-style:normal;
    font-weight:400;
    src:url('//cdn.df.nexon.com/img/common/font/DNFBitBitv2.otf')format('opentype')
  }
    body {
      font-family: 'MaplestoryOTFBold';
  }
`;
