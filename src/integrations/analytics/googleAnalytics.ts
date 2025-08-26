export const initAnalytics = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;

  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  // @ts-expect-error - gtag will be available after script loads
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', measurementId);
};

export const trackEvent = (event: string, params?: Record<string, any>) => {
  // @ts-expect-error - gtag is injected globally
  if (typeof window.gtag === 'function') {
    // @ts-expect-error
    window.gtag('event', event, params);
  }
};

export const trackWaitlistSignup = (email: string) => {
  trackEvent('waitlist_signup', { email });
};

export default { initAnalytics, trackEvent, trackWaitlistSignup };
