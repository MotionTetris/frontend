import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { loadEffect } from "./pages/Room/InGame/Rapier/Effect/EffectLoader";
import { ROOM_BG1_URL, ROOM_BG2_URL, ROOM_BG3_URL, ROOM_BG4_URL, ROOM_BG5_URL, TUTORIAL_2_GIF, TUTORIAL_3_GIF, TUTORIAL_5_GIF } from "./config";
// import React from 'react';
await loadEffect();
await preloadAsset();
ReactDOM.createRoot(document.getElementById("root")!).render(
  //<React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>,
//</React.StrictMode>
);

/* We are going to pre-load some images */
async function preloadAsset() {
  new Image().src = ROOM_BG1_URL;
  new Image().src = ROOM_BG2_URL;
  new Image().src = ROOM_BG3_URL;
  new Image().src = ROOM_BG4_URL;
  new Image().src = ROOM_BG5_URL;

  new Image().src = TUTORIAL_2_GIF;
  new Image().src = TUTORIAL_3_GIF;
  new Image().src = TUTORIAL_5_GIF;
}