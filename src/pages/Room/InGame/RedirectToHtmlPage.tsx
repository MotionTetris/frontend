// RedirectToHtmlPage.tsx
import { useEffect } from 'react';

const RedirectToHtmlPage = () => {
  useEffect(() => {
    window.location.href = '/GamePlay.html';
  }, []);

  return null;
};

export default RedirectToHtmlPage;
