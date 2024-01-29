import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux';
import { store } from './app/store';
import React from 'react';
import { worker } from './mocks/Browser';

if (process.env.NODE_ENV === 'development') {
  worker.start();
  console.log(worker);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
