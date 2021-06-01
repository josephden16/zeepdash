import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';


const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (process.env.NODE_ENV === "test") { }
    else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

export default ScrollToTop;
