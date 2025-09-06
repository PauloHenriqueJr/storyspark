import { HooksLibrary } from "@/components/HooksLibrary";
import { useEffect } from "react";

const Hooks = () => {
  useEffect(() => {
    // Set page title
    document.title = "Biblioteca de Hooks - StorySpark";
    
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: 'Hooks Library',
        page_location: window.location.href
      });
    }
  }, []);

  return <HooksLibrary />;
};

export default Hooks;