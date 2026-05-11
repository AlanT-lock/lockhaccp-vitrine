// Vitrine analytics — anonymous tracking, no cookies, no PII at first touch.
// Sends events to the admin Supabase edge function `track-event`.

const ENDPOINT = import.meta.env.VITE_ANALYTICS_ENDPOINT as string | undefined;
const VISITOR_KEY = "lhc_visitor_id";
const SESSION_KEY = "lhc_session";
const SESSION_GAP_MS = 30 * 60 * 1000;
const FLUSH_INTERVAL_MS = 5000;

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Fallback (RFC4122 v4)
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b).map((x) => x.toString(16).padStart(2, "0"));
  return (
    h[0] + h[1] + h[2] + h[3] +
    "-" + h[4] + h[5] +
    "-" + h[6] + h[7] +
    "-" + h[8] + h[9] +
    "-" + h[10] + h[11] + h[12] + h[13] + h[14] + h[15]
  );
}

function getVisitorId(): string {
  try {
    const existing = localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
    const id = uuid();
    localStorage.setItem(VISITOR_KEY, id);
    return id;
  } catch {
    // Private mode without storage: ephemeral per page-load
    return uuid();
  }
}

type SessionInfo = { id: string; startedAt: number; lastActivityAt: number };

function readSession(): SessionInfo | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
      ?? localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SessionInfo;
    if (!parsed.id || typeof parsed.lastActivityAt !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeSession(s: SessionInfo): void {
  try {
    const raw = JSON.stringify(s);
    sessionStorage.setItem(SESSION_KEY, raw);
    localStorage.setItem(SESSION_KEY, raw);
  } catch {
    /* ignore */
  }
}

function getOrCreateSession(): { id: string; isNew: boolean } {
  const now = Date.now();
  const existing = readSession();
  if (existing && now - existing.lastActivityAt < SESSION_GAP_MS) {
    existing.lastActivityAt = now;
    writeSession(existing);
    return { id: existing.id, isNew: false };
  }
  const session: SessionInfo = { id: uuid(), startedAt: now, lastActivityAt: now };
  writeSession(session);
  return { id: session.id, isNew: true };
}

function touchSession(): void {
  const existing = readSession();
  if (!existing) return;
  existing.lastActivityAt = Date.now();
  writeSession(existing);
}

function readUtm(): Record<string, string | undefined> {
  try {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get("utm_source") ?? undefined,
      utm_medium: params.get("utm_medium") ?? undefined,
      utm_campaign: params.get("utm_campaign") ?? undefined,
      utm_content: params.get("utm_content") ?? undefined,
      utm_term: params.get("utm_term") ?? undefined,
    };
  } catch {
    return {};
  }
}

type AnalyticsEvent =
  | {
      type: "session_start";
      referrer?: string;
      utm_source?: string;
      utm_medium?: string;
      utm_campaign?: string;
      utm_content?: string;
      utm_term?: string;
      screen_width?: number;
      screen_height?: number;
      language?: string;
      landing_path?: string;
    }
  | {
      type: "page_view";
      client_view_id: string;
      path: string;
      page_title?: string;
      referrer?: string;
    }
  | {
      type: "page_leave";
      client_view_id: string;
      time_on_page_seconds: number;
      max_scroll_pct: number;
    }
  | {
      type: "identify";
      email: string;
      path?: string;
    }
  | {
      type: "event";
      event_name: string;
      path?: string;
      properties?: Record<string, unknown>;
    };

const queue: AnalyticsEvent[] = [];
let flushTimer: number | null = null;
let initialized = false;
let visitorId = "";
let sessionId = "";

function scheduleFlush(): void {
  if (flushTimer !== null) return;
  flushTimer = window.setTimeout(() => {
    flushTimer = null;
    void flush();
  }, FLUSH_INTERVAL_MS);
}

async function flush(useBeacon = false): Promise<void> {
  if (!ENDPOINT || queue.length === 0 || !visitorId || !sessionId) return;
  const events = queue.splice(0, queue.length);
  const body = JSON.stringify({
    visitor_id: visitorId,
    session_id: sessionId,
    events,
  });

  if (useBeacon && "sendBeacon" in navigator) {
    try {
      const blob = new Blob([body], { type: "application/json" });
      const ok = navigator.sendBeacon(ENDPOINT, blob);
      if (ok) return;
    } catch {
      /* fall through to fetch */
    }
  }

  try {
    await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    // Drop on failure to avoid memory growth on repeated errors.
  }
}

function enqueue(ev: AnalyticsEvent): void {
  queue.push(ev);
  if (queue.length >= 10) {
    void flush();
  } else {
    scheduleFlush();
  }
}

// Per-page-view state for time/scroll tracking
let currentViewId: string | null = null;
let currentPath: string | null = null;
let currentMaxScrollPct = 0;
let currentAccumulatedMs = 0;
let lastVisibleAt = 0;

function computeScrollPct(): number {
  const doc = document.documentElement;
  const body = document.body;
  const scrollTop = window.scrollY || doc.scrollTop || body.scrollTop || 0;
  const viewport = window.innerHeight || doc.clientHeight || 0;
  const fullHeight = Math.max(
    body.scrollHeight,
    doc.scrollHeight,
    body.offsetHeight,
    doc.offsetHeight,
    doc.clientHeight,
  );
  if (fullHeight <= 0) return 0;
  const pct = Math.round(((scrollTop + viewport) / fullHeight) * 100);
  return Math.max(0, Math.min(100, pct));
}

function onScroll(): void {
  if (currentViewId === null) return;
  const pct = computeScrollPct();
  if (pct > currentMaxScrollPct) currentMaxScrollPct = pct;
  touchSession();
}

function startVisibleSegment(): void {
  if (lastVisibleAt === 0) lastVisibleAt = Date.now();
}

function stopVisibleSegment(): void {
  if (lastVisibleAt > 0) {
    currentAccumulatedMs += Date.now() - lastVisibleAt;
    lastVisibleAt = 0;
  }
}

function onVisibilityChange(): void {
  if (document.visibilityState === "visible") {
    startVisibleSegment();
  } else {
    stopVisibleSegment();
    void flush(true);
  }
}

function onPageHide(): void {
  emitLeave();
  void flush(true);
}

function emitLeave(): void {
  if (!currentViewId) return;
  stopVisibleSegment();
  const seconds = Math.max(0, Math.round(currentAccumulatedMs / 1000));
  enqueue({
    type: "page_leave",
    client_view_id: currentViewId,
    time_on_page_seconds: seconds,
    max_scroll_pct: currentMaxScrollPct,
  });
  currentViewId = null;
  currentPath = null;
  currentMaxScrollPct = 0;
  currentAccumulatedMs = 0;
  lastVisibleAt = 0;
}

function attachListenersOnce(): void {
  if (typeof window === "undefined") return;
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("pagehide", onPageHide);
  window.addEventListener("beforeunload", onPageHide);
}

function init(): void {
  if (initialized) return;
  if (!ENDPOINT) return; // tracking disabled when env var is missing
  initialized = true;
  visitorId = getVisitorId();
  const { id, isNew } = getOrCreateSession();
  sessionId = id;

  if (isNew) {
    const utm = readUtm();
    enqueue({
      type: "session_start",
      referrer: document.referrer || undefined,
      ...utm,
      screen_width: window.screen?.width,
      screen_height: window.screen?.height,
      language: navigator.language,
      landing_path: window.location.pathname,
    });
  }

  attachListenersOnce();
}

export function trackPageView(path: string, pageTitle?: string): void {
  init();
  if (!initialized) return;

  // Refresh session if it expired since last action
  const { id, isNew } = getOrCreateSession();
  if (id !== sessionId) {
    sessionId = id;
    if (isNew) {
      const utm = readUtm();
      enqueue({
        type: "session_start",
        referrer: document.referrer || undefined,
        ...utm,
        screen_width: window.screen?.width,
        screen_height: window.screen?.height,
        language: navigator.language,
        landing_path: path,
      });
    }
  }

  // If we were already on a page, emit its leave first
  if (currentViewId) emitLeave();

  currentViewId = uuid();
  currentPath = path;
  currentMaxScrollPct = 0;
  currentAccumulatedMs = 0;
  lastVisibleAt = document.visibilityState === "visible" ? Date.now() : 0;

  enqueue({
    type: "page_view",
    client_view_id: currentViewId,
    path,
    page_title: pageTitle ?? document.title,
    referrer: document.referrer || undefined,
  });
  touchSession();
}

export function identify(email: string): void {
  init();
  if (!initialized || !email) return;
  enqueue({
    type: "identify",
    email,
    path: currentPath ?? window.location.pathname,
  });
  void flush();
}

export function trackEvent(
  event_name: string,
  properties?: Record<string, unknown>,
): void {
  init();
  if (!initialized) return;
  enqueue({
    type: "event",
    event_name,
    path: currentPath ?? window.location.pathname,
    properties,
  });
  touchSession();
}
