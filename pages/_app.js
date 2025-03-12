import '../styles/globals.css';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // This runs after page load and directly manipulates the DOM
    function removeHeader() {
      // Target the exact header element we saw in your screenshot
      const headers = document.querySelectorAll('header');
      headers.forEach(header => {
        if (header && header.classList.contains('fixed')) {
          header.remove(); // Completely removes the element from DOM
        }
      });
      
      // Also try to remove by direct class names
      const tealElements = document.querySelectorAll('.bg-teal-700');
      tealElements.forEach(el => {
        if (el.tagName === 'HEADER' || el.classList.contains('fixed')) {
          el.remove();
        }
      });
    }
    
    // Run immediately and several times to catch any delayed rendering
    removeHeader();
    setTimeout(removeHeader, 100);
    setTimeout(removeHeader, 500);
    
    // Also set up an observer to catch dynamically added headers
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          removeHeader();
        }
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
