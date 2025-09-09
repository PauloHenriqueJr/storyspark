import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '@/services/analytics';

export const RouteTracker = () => {
    const location = useLocation();

    useEffect(() => {
        const trackable = ['/waitlist', '/lp'];
        if (!trackable.includes(location.pathname)) return;

        const thresholds = [25, 50, 75, 100];
        const fired = new Set<number>();

        const onScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const percent = Math.min(100, Math.round((scrollTop / Math.max(1, docHeight)) * 100));

            thresholds.forEach(t => {
                if (percent >= t && !fired.has(t)) {
                    analytics.track('scroll_depth', { path: location.pathname, depth: t });
                    fired.add(t);
                }
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true } as any);
        onScroll();

        return () => window.removeEventListener('scroll', onScroll);
    }, [location.pathname]);

    return null;
};
