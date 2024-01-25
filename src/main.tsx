import ReactDOM from 'react-dom/client'
import App from './App'  // App 컴포넌트를 임포트합니다.
import { Provider } from 'react-redux';
import { store } from './app/store'; // store를 올바르게 import 했는지 확인

// MSW를 임포트합니다.
if (process.env.NODE_ENV === 'development') {
  import('./mocks/Browser').then(({ worker }) => {
    worker.start();
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(

  <Provider store={store}>
  <App />
</Provider>

)
