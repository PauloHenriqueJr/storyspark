// Lightweight analytics wrapper with graceful fallbacks

type Props = Record<string, any>;

const isDev = import.meta.env.DEV;

const send = (event: string, props?: Props) => {
  // Send to dataLayer (GA/GTM) if present
  (window as any).dataLayer?.push({
    event,
    ...props,
  });

  // Optional: expose global hook for custom trackers
  (window as any).__storysparkTrack?.(event, props);

  if (isDev) {
    console.debug('[analytics]', event, props || {});
  }
};

export const analytics = {
  init() {
    if (!('dataLayer' in window)) {
      (window as any).dataLayer = [];
    }
  },
  track(event: string, props?: Props) {
    try {
      send(event, props);
    } catch (e) {
      if (isDev) console.warn('analytics track failed', e);
    }
  },
  identify(id: string, traits?: Props) {
    this.track('identify', { user_id: id, traits });
  },
};

export type { Props as AnalyticsProps };

