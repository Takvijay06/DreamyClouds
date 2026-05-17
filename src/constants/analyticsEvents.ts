/**
 * Central GA4 event names (snake_case for consistency with GA4 recommended naming).
 * Do not include PII in event names or parameter keys.
 */
export const ANALYTICS_EVENTS = {
  CONTACT_FORM_SUBMIT: 'contact_form_submit',
  FORM_VALIDATION_ERROR: 'form_validation_error',
  FORM_ABANDONMENT: 'form_abandonment',
  WHATSAPP_CLICK: 'whatsapp_click',
  SERVICE_CARD_CLICK: 'service_card_click',
  PRICING_VIEW: 'pricing_view',
  PORTFOLIO_VIEW: 'portfolio_view',
  QUOTE_REQUEST: 'quote_request',
  SCHEDULE_MEETING: 'schedule_meeting',
  EMAIL_CLICK: 'email_click',
  CALL_CLICK: 'call_click',
  /** Shop funnel / navigation */
  OUTBOUND_LINK: 'outbound_link',
  PAGE_SCROLL_DEPTH: 'page_scroll_depth',
  API_REQUEST_FAILED: 'api_request_failed',
  RUNTIME_EXCEPTION: 'runtime_exception',
  UTM_CAPTURE: 'utm_capture',
  SESSION_ENGAGEMENT: 'session_engagement',
  USER_JOURNEY_STEP: 'user_journey_step'
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

/** Standard parameter keys (avoid PII values). */
export const ANALYTICS_PARAMS = {
  CATEGORY: 'event_category',
  ACTION: 'event_action',
  LABEL: 'event_label',
  PATH: 'page_path',
  LINK_URL: 'link_url',
  LINK_DOMAIN: 'link_domain',
  SCROLL_PCT: 'scroll_percent',
  ERROR_MESSAGE: 'error_message',
  ERROR_STACK: 'has_stack',
  API_OPERATION: 'api_operation',
  FUNNEL_STEP: 'funnel_step',
  FUNNEL_INDEX: 'funnel_index'
} as const;
