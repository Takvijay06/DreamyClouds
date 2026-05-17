/**
 * Centralized GA4 analytics (react-ga4). Loads only after initializeAnalytics(); all helpers no-op if disabled.
 * Privacy: never pass names, emails, phone numbers, or free-form user text in event params.
 */
import ReactGA from 'react-ga4';
import { ANALYTICS_EVENTS, ANALYTICS_PARAMS, type AnalyticsEventName } from '../constants/analyticsEvents';

/** GA4 Measurement ID (configured in source; consent still optional via `VITE_GA_REQUIRE_CONSENT`). */
export const GA4_MEASUREMENT_ID = 'G-DV63FTXYS3';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
const UTM_SESSION_KEY = 'dreamyclouds_ga_utm_logged';
const SCROLL_RESET_PREFIX = 'dreamyclouds_scroll_';

let initialized = false;
let sessionStartedAt = 0;
let engagementIntervalId: number | null = null;

const getMeasurementId = (): string | undefined => {
  const id = GA4_MEASUREMENT_ID.trim();
  return id.length > 0 ? id : undefined;
};

/** True when a valid G- Measurement ID is configured. */
export const isAnalyticsConfigured = (): boolean => {
  const id = getMeasurementId();
  return !!id && id.startsWith('G-');
};

/**
 * Optional consent gate: set localStorage `dreamyclouds_analytics_consent` to `granted` | `denied`.
 * If VITE_GA_REQUIRE_CONSENT === 'true', initialization waits for `granted`.
 */
export const hasAnalyticsConsent = (): boolean => {
  if (import.meta.env.VITE_GA_REQUIRE_CONSENT !== 'true') {
    return true;
  }
  try {
    return localStorage.getItem('dreamyclouds_analytics_consent') === 'granted';
  } catch {
    return false;
  }
};

export const setAnalyticsConsent = (granted: boolean): void => {
  try {
    localStorage.setItem('dreamyclouds_analytics_consent', granted ? 'granted' : 'denied');
    if (granted && isAnalyticsConfigured() && !initialized) {
      initializeAnalytics();
    }
  } catch {
    /* ignore storage failures */
  }
};

const safeParams = (params: Record<string, unknown>): Record<string, string | number | boolean> => {
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
      out[k] = v;
    }
  }
  return out;
};

const stripUrlForAnalytics = (href: string): { url: string; domain: string } => {
  try {
    const u = new URL(href, window.location.origin);
    return { url: `${u.pathname}${u.search}`, domain: u.hostname };
  } catch {
    return { url: href.slice(0, 120), domain: 'unknown' };
  }
};

function captureUtmOnce(): void {
  if (typeof window === 'undefined' || !sessionStorage.getItem) return;
  try {
    if (sessionStorage.getItem(UTM_SESSION_KEY)) return;
    const search = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const v = search.get(key);
      if (v) utm[key] = v.slice(0, 120);
    }
    if (Object.keys(utm).length === 0) return;
    sessionStorage.setItem(UTM_SESSION_KEY, '1');
    trackNamedEvent(ANALYTICS_EVENTS.UTM_CAPTURE, utm);
  } catch {
    /* ignore */
  }
}

/**
 * Initialize GA4 once. Non-throwing. Call after first paint (e.g. requestIdleCallback) to avoid blocking.
 */
export function initializeAnalytics(): void {
  if (initialized || !isAnalyticsConfigured() || !hasAnalyticsConsent()) {
    return;
  }

  const measurementId = getMeasurementId()!;
  try {
    ReactGA.initialize(measurementId, {
      gtagOptions: {
        send_page_view: false
      }
    });
    initialized = true;
    sessionStartedAt = Date.now();
    captureUtmOnce();
    installGlobalErrorHandlers();
    installSessionEngagementHeartbeat();
  } catch {
    initialized = false;
  }
}

/** Defer init until browser is idle (or short timeout fallback). */
export function scheduleAnalyticsInit(): void {
  const run = () => initializeAnalytics();
  if (typeof window === 'undefined') return;

  const ric = window.requestIdleCallback;
  if (typeof ric === 'function') {
    ric(() => run(), { timeout: 500 });
    return;
  }
  window.setTimeout(run, 0);
}

let lastPagePathTracked = '';

/**
 * Manual page_view. Pass full path+search to match SPA routes uniquely.
 * De-duplicates identical consecutive paths.
 */
export function trackPageView(path: string, title?: string): void {
  if (!initialized || !path) return;
  if (path === lastPagePathTracked) return;
  lastPagePathTracked = path;

  try {
    ReactGA.send({
      hitType: 'pageview',
      page: path,
      title: title ?? document.title
    });
  } catch {
    /* ignore */
  }
}

/** Reset page de-dupe + scroll milestones when forcing a full logical navigation. */
export function resetPageTrackingState(): void {
  lastPagePathTracked = '';
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      const keys: string[] = [];
      for (let i = 0; i < sessionStorage.length; i += 1) {
        const k = sessionStorage.key(i);
        if (k?.startsWith(SCROLL_RESET_PREFIX)) keys.push(k);
      }
      keys.forEach((k) => sessionStorage.removeItem(k));
    } catch {
      /* ignore */
    }
  }
}

/**
 * Legacy-style event (category / action / label) mapped to GA4-friendly params.
 */
export function trackEvent(category: string, action: string, label?: string, value?: number): void {
  if (!initialized) return;
  try {
    ReactGA.event({
      category,
      action,
      ...(label !== undefined ? { label } : {}),
      ...(value !== undefined ? { value } : {})
    });
  } catch {
    /* ignore */
  }
}

/** GA4 custom event with arbitrary safe params (no PII). Kept lightweight — no per-event layout reads. */
export function trackNamedEvent(eventName: AnalyticsEventName | string, params?: Record<string, unknown>): void {
  if (!initialized) return;
  try {
    ReactGA.event(eventName, safeParams(params ?? {}));
  } catch {
    /* ignore */
  }
}

export function trackException(error: unknown, fatal = false, context?: string): void {
  if (!initialized) return;
  const message =
    error instanceof Error
      ? error.message.slice(0, 500)
      : typeof error === 'string'
        ? error.slice(0, 500)
        : 'unknown_error';

  try {
    trackNamedEvent(ANALYTICS_EVENTS.RUNTIME_EXCEPTION, {
      [ANALYTICS_PARAMS.ERROR_MESSAGE]: message,
      fatal,
      [ANALYTICS_PARAMS.ERROR_STACK]: error instanceof Error && !!error.stack,
      ...(context ? { context: context.slice(0, 80) } : {})
    });
  } catch {
    /* ignore */
  }
}

export function trackApiFailure(operation: string, message: string): void {
  if (!initialized) return;
  trackNamedEvent(ANALYTICS_EVENTS.API_REQUEST_FAILED, {
    [ANALYTICS_PARAMS.API_OPERATION]: operation.slice(0, 80),
    [ANALYTICS_PARAMS.ERROR_MESSAGE]: message.slice(0, 200)
  });
}

export function trackOutboundLink(href: string, linkLabel?: string): void {
  if (!initialized) return;
  const { url, domain } = stripUrlForAnalytics(href);
  trackNamedEvent(ANALYTICS_EVENTS.OUTBOUND_LINK, {
    [ANALYTICS_PARAMS.LINK_URL]: url,
    [ANALYTICS_PARAMS.LINK_DOMAIN]: domain,
    ...(linkLabel ? { [ANALYTICS_PARAMS.LABEL]: linkLabel.slice(0, 80) } : {})
  });
}

export function trackScrollDepthMilestone(pathKey: string, percent: 25 | 50 | 75 | 90): void {
  if (!initialized || typeof sessionStorage === 'undefined') return;
  const storageKey = `${SCROLL_RESET_PREFIX}${pathKey}_${percent}`;
  try {
    if (sessionStorage.getItem(storageKey)) return;
    sessionStorage.setItem(storageKey, '1');
    trackNamedEvent(ANALYTICS_EVENTS.PAGE_SCROLL_DEPTH, {
      [ANALYTICS_PARAMS.PATH]: pathKey.slice(0, 200),
      [ANALYTICS_PARAMS.SCROLL_PCT]: percent
    });
  } catch {
    /* ignore */
  }
}

export function trackUserJourneyFunnel(step: string, index?: number): void {
  if (!initialized) return;
  trackNamedEvent(ANALYTICS_EVENTS.USER_JOURNEY_STEP, {
    [ANALYTICS_PARAMS.FUNNEL_STEP]: step.slice(0, 80),
    ...(typeof index === 'number' ? { [ANALYTICS_PARAMS.FUNNEL_INDEX]: index } : {})
  });
}

function installGlobalErrorHandlers(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    const err = event.error ?? new Error(event.message);
    trackException(err, false, 'window_error');
  });

  window.addEventListener('unhandledrejection', (event) => {
    trackException(event.reason, false, 'unhandledrejection');
  });
}

function installSessionEngagementHeartbeat(): void {
  if (typeof window === 'undefined' || engagementIntervalId !== null) return;

  const sendPulse = () => {
    if (!initialized) return;
    const seconds = Math.round((Date.now() - sessionStartedAt) / 1000);
    if (seconds < 5) return;
    trackNamedEvent(ANALYTICS_EVENTS.SESSION_ENGAGEMENT, {
      engagement_seconds: Math.min(seconds, 86400)
    });
  };

  engagementIntervalId = window.setInterval(sendPulse, 5 * 60 * 1000);
  window.addEventListener('beforeunload', () => sendPulse());
}

/** Test hook / rare full reset */
export function __resetAnalyticsTestState(): void {
  lastPagePathTracked = '';
  if (engagementIntervalId !== null) {
    window.clearInterval(engagementIntervalId);
    engagementIntervalId = null;
  }
}
