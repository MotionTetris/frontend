import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'  // App 컴포넌트를 임포트합니다.

// MSW를 임포트합니다.
if (process.env.NODE_ENV === 'development') {
  import('./mocks/Browser').then(({ worker }) => {
    worker.start();
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <App />
  </React.StrictMode>,
)
