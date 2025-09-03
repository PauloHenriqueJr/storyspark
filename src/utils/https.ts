/**
 * HTTPS Enforcement Utilities
 * Ensures all requests and resources use HTTPS in production
 */

// Check if we're in production and should enforce HTTPS
export const shouldForceHTTPS = (): boolean => {
  return import.meta.env.PROD && 
         import.meta.env.VITE_FORCE_HTTPS === 'true' &&
         typeof window !== 'undefined' &&
         window.location.protocol === 'http:' &&
         !window.location.hostname.includes('localhost');
};

// Redirect to HTTPS if needed
export const enforceHTTPS = (): void => {
  if (shouldForceHTTPS()) {
    const httpsUrl = window.location.href.replace('http://', 'https://');
    console.log('🔒 Redirecting to HTTPS:', httpsUrl);
    window.location.replace(httpsUrl);
  }
};

// Ensure URL uses HTTPS in production
export const ensureHTTPS = (url: string): string => {
  if (!url) return url;
  
  // If it's a relative URL, return as-is
  if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
    return url;
  }
  
  // If it's an absolute URL and we're in production, force HTTPS
  if (import.meta.env.PROD && url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  
  return url;
};

// Create secure fetch wrapper
export const secureFetch = (url: string, options?: RequestInit): Promise<Response> => {
  const secureUrl = ensureHTTPS(url);
  return fetch(secureUrl, {
    ...options,
    // Add security headers
    headers: {
      ...options?.headers,
      'X-Requested-With': 'XMLHttpRequest',
      'Cache-Control': 'no-cache',
    },
  });
};

// Configure CSP for HTTPS enforcement
export const getCSPHeaders = (): Record<string, string> => {
  if (!import.meta.env.PROD) return {};
  
  return {
    'Content-Security-Policy': [
      "default-src 'self' https:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
      "style-src 'self' 'unsafe-inline' https:",
      "img-src 'self' data: https:",
      "font-src 'self' https:",
      "connect-src 'self' https:",
      "media-src 'self' https:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https:",
      "frame-ancestors 'none'",
      "block-all-mixed-content",
      "upgrade-insecure-requests"
    ].join('; ')
  };
};

// Initialize HTTPS enforcement on app load
export const initHTTPSEnforcement = (): void => {
  // Only run in browser
  if (typeof window === 'undefined') return;
  
  // Enforce HTTPS redirect
  enforceHTTPS();
  
  // Set up CSP headers if possible
  const cspHeaders = getCSPHeaders();
  if (Object.keys(cspHeaders).length > 0) {
    // Try to set meta tag for CSP
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = cspHeaders['Content-Security-Policy'];
    document.head.appendChild(cspMeta);
  }
  
  // Log HTTPS status
  console.log('🔒 HTTPS Status:', {
    protocol: window.location.protocol,
    hostname: window.location.hostname,
    isSecure: window.location.protocol === 'https:',
    shouldForceHTTPS: shouldForceHTTPS()
  });
};
