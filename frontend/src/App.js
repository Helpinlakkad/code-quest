import React, { useEffect } from 'react';
import Search from './api/components/Search';

const App = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.weglot.com/weglot.min.js';
    script.async = true;
    script.onload = () => {
      if (window.Weglot) {
        window.Weglot.initialize({
          api_key: process.env.API_KEY
        });
      }
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <h1>Code Quest: Knowledge Base Application</h1>
      <Search />
    </div>
  );
};

export default App;
