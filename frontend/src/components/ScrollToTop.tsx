// components/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // This ensures the user starts at the peak of your content.
    window.scrollTo(0, 0);
  }, [pathname]); // Fires every time the URL changes

  return null; 
}
