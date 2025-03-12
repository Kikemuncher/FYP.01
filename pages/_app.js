import '../styles/globals.css';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // This will run on the client-side after the page loads
    // It attempts to find and hide any header elements
    const hideHeaders = () => {
      // Try to find headers by various selectors
      const selectors = [
        'div.fixed.top-0',
        'div.bg-teal-700',
        'div.w-full.flex.justify-center.z-50',
        'header',
        '.fixed:not(img)'
      ];
      
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (el.tagName !== 'IMG') {
            el.style.display = 'none';
            el.style.opacity = '0';
            el.style.visibility = 'hidden';
            el.style.height = '0';
            el.style.overflow = 'hidden';
          }
        });
      });
    };
    
    // Hide headers immediately and after a short delay (for any late-loading content)
    hideHeaders();
    setTimeout(hideHeaders, 100);
    setTimeout(hideHeaders, 500);
    
  }, []);
  
  return <Component {...pageProps} />;
}

export default MyApp;
