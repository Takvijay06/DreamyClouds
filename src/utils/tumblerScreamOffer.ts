import { fetchScreamOfferVisibility } from '../features/offers/offersApi';

export const SCREAM_OFFER_STORAGE_KEY = 'dreamyclouds-tumbler-scream-offer';
export const SCREAM_OFFER_VALID_MS = 10 * 60 * 1000;
export const SCREAM_INTERACTION_MS = 5000;
export const SCREAM_INTERACTION_SECONDS = SCREAM_INTERACTION_MS / 1000;
/** Actual discount applied at checkout after the scream window is activated. */
export const SCREAM_OFFER_DISCOUNT_PERCENT = 5;
/** Promotional copy only — shown in banners and modal before reveal. */
export const SCREAM_OFFER_SHOWCASE_DISCOUNT_PERCENT = 15;

export type ScreamOfferRecord = {
  unlockedAt: number | null;
  redeemed: boolean;
  lastScreamDay: string | null;
  discountRevealed: boolean;
};

export type ScreamOfferSnapshot = {
  isWeekend: boolean;
  isOfferVisible: boolean;
  hasScreamedToday: boolean;
  discountRevealed: boolean;
  awaitingActivation: boolean;
  redeemed: boolean;
  isActive: boolean;
  remainingMs: number;
  unlockedAt: number | null;
};

const EMPTY_RECORD: ScreamOfferRecord = {
  unlockedAt: null,
  redeemed: false,
  lastScreamDay: null,
  discountRevealed: false
};

const listeners = new Set<() => void>();
let cachedSnapshot: ScreamOfferSnapshot | undefined;
let activeTickInterval: number | null = null;
let screamOfferApiVisible = false;
let screamOfferVisibilityLoaded = false;

export const getLocalDayKey = (date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const snapshotsEqual = (left: ScreamOfferSnapshot, right: ScreamOfferSnapshot): boolean =>
  left.isWeekend === right.isWeekend &&
  left.isOfferVisible === right.isOfferVisible &&
  left.hasScreamedToday === right.hasScreamedToday &&
  left.discountRevealed === right.discountRevealed &&
  left.awaitingActivation === right.awaitingActivation &&
  left.redeemed === right.redeemed &&
  left.isActive === right.isActive &&
  left.remainingMs === right.remainingMs &&
  left.unlockedAt === right.unlockedAt;

const stopActiveTick = (): void => {
  if (activeTickInterval !== null) {
    window.clearInterval(activeTickInterval);
    activeTickInterval = null;
  }
};

const syncActiveTick = (snapshot: ScreamOfferSnapshot): void => {
  if (!snapshot.isActive) {
    stopActiveTick();
    return;
  }

  if (activeTickInterval !== null) {
    return;
  }

  activeTickInterval = window.setInterval(() => {
    const current = computeScreamOfferSnapshot();
    if (!current.isActive) {
      stopActiveTick();
    }
    notifyScreamOfferChange();
  }, 1000);
};

export const subscribeScreamOffer = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const notifyScreamOfferChange = (): void => {
  const previous = cachedSnapshot;
  cachedSnapshot = undefined;
  const next = computeScreamOfferSnapshot();

  if (previous && snapshotsEqual(previous, next)) {
    cachedSnapshot = previous;
    return;
  }

  cachedSnapshot = next;
  syncActiveTick(next);
  listeners.forEach((listener) => listener());
};

export const isWeekend = (date = new Date()): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

const readStoredRecord = (): ScreamOfferRecord => {
  if (typeof window === 'undefined') {
    return EMPTY_RECORD;
  }

  try {
    const raw = window.localStorage.getItem(SCREAM_OFFER_STORAGE_KEY);
    if (!raw) {
      return EMPTY_RECORD;
    }
    const parsed = JSON.parse(raw) as Partial<ScreamOfferRecord> & { unlockedAt?: number | null };
    const unlockedAt = typeof parsed.unlockedAt === 'number' ? parsed.unlockedAt : null;
    const lastScreamDay =
      typeof parsed.lastScreamDay === 'string'
        ? parsed.lastScreamDay
        : unlockedAt !== null
          ? getLocalDayKey(new Date(unlockedAt))
          : null;

    return {
      unlockedAt,
      redeemed: parsed.redeemed === true,
      lastScreamDay,
      discountRevealed: parsed.discountRevealed === true
    };
  } catch {
    return EMPTY_RECORD;
  }
};

const readRecord = (): ScreamOfferRecord => {
  const record = readStoredRecord();
  const today = getLocalDayKey();
  if (record.lastScreamDay !== null && record.lastScreamDay !== today) {
    return EMPTY_RECORD;
  }
  return record;
};

const writeRecord = (record: ScreamOfferRecord): void => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(SCREAM_OFFER_STORAGE_KEY, JSON.stringify(record));
  notifyScreamOfferChange();
};

export const hasScreamedToday = (record = readRecord(), now = Date.now()): boolean =>
  record.lastScreamDay === getLocalDayKey(new Date(now));

export const getScreamOfferRemainingMs = (record = readRecord(), now = Date.now()): number => {
  if (record.redeemed || record.unlockedAt === null) {
    return 0;
  }
  return Math.max(0, record.unlockedAt + SCREAM_OFFER_VALID_MS - now);
};

export const isScreamOfferActive = (record = readRecord(), now = Date.now()): boolean =>
  screamOfferApiVisible && !record.redeemed && getScreamOfferRemainingMs(record, now) > 0;

export const isScreamOfferConfiguredVisible = (): boolean => screamOfferApiVisible;

export const isScreamOfferVisibilityLoaded = (): boolean => screamOfferVisibilityLoaded;

export const setScreamOfferApiVisibility = (visible: boolean): void => {
  screamOfferVisibilityLoaded = true;
  if (screamOfferApiVisible === visible) {
    return;
  }
  screamOfferApiVisible = visible;
  notifyScreamOfferChange();
};

export const isScreamOfferAwaitingActivation = (record = readRecord()): boolean =>
  record.discountRevealed && record.unlockedAt === null && !record.redeemed;

const computeScreamOfferSnapshot = (now = Date.now()): ScreamOfferSnapshot => {
  const record = readRecord();
  const rawRemainingMs = getScreamOfferRemainingMs(record, now);
  const remainingMs = rawRemainingMs > 0 ? Math.ceil(rawRemainingMs / 1000) * 1000 : 0;

  return {
    isWeekend: isWeekend(new Date(now)),
    isOfferVisible: screamOfferApiVisible,
    hasScreamedToday: hasScreamedToday(record, now),
    discountRevealed: record.discountRevealed,
    awaitingActivation: isScreamOfferAwaitingActivation(record),
    redeemed: record.redeemed,
    isActive: remainingMs > 0,
    remainingMs,
    unlockedAt: record.unlockedAt
  };
};

export const getScreamOfferSnapshot = (now = Date.now()): ScreamOfferSnapshot => {
  const next = computeScreamOfferSnapshot(now);

  if (cachedSnapshot && snapshotsEqual(cachedSnapshot, next)) {
    return cachedSnapshot;
  }

  cachedSnapshot = next;
  syncActiveTick(next);
  return next;
};

/** Called when the 5-second scream countdown finishes — reveals discount but does not start the 10-minute window yet. */
export const revealScreamOfferDiscount = (): ScreamOfferSnapshot => {
  const record = readRecord();
  const today = getLocalDayKey();

  if (hasScreamedToday(record) || record.redeemed) {
    return getScreamOfferSnapshot();
  }

  writeRecord({
    ...record,
    lastScreamDay: today,
    discountRevealed: true,
    unlockedAt: null,
    redeemed: false
  });
  return getScreamOfferSnapshot();
};

/** Called when the user closes the modal after the discount is revealed — starts the 10-minute offer window. */
export const activateScreamOfferWindow = (): ScreamOfferSnapshot => {
  const record = readRecord();

  if (!record.discountRevealed || record.redeemed || record.unlockedAt !== null) {
    return getScreamOfferSnapshot();
  }

  writeRecord({
    ...record,
    unlockedAt: Date.now()
  });
  return getScreamOfferSnapshot();
};

export const redeemScreamOffer = (): void => {
  const record = readRecord();
  writeRecord({
    ...record,
    redeemed: true,
    lastScreamDay: record.lastScreamDay ?? getLocalDayKey()
  });
};

export const calculateScreamOfferDiscount = (merchandiseSubtotal: number, active: boolean): number => {
  if (!active || merchandiseSubtotal <= 0) {
    return 0;
  }
  return Math.min(merchandiseSubtotal, Math.round((merchandiseSubtotal * SCREAM_OFFER_DISCOUNT_PERCENT) / 100));
};

export const formatScreamOfferCountdown = (remainingMs: number): string => {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const SCREAM_OFFER_BANNER = {
  id: 'tumbler-scream',
  text: `Weekend Tumbler Scream: ${SCREAM_INTERACTION_SECONDS}s shout & unlock up to ${SCREAM_OFFER_SHOWCASE_DISCOUNT_PERCENT}% off (10 min, once daily).`,
  bar: 'from-sky-400 via-indigo-500 to-violet-600',
  chip: 'from-sky-500/20 to-violet-500/15',
  chipText: 'text-indigo-950',
  dotActive: 'from-sky-500 via-indigo-500 to-violet-600'
} as const;

export const isScreamOfferBannerVisible = (): boolean => {
  const snapshot = getScreamOfferSnapshot();
  return (
    snapshot.isOfferVisible &&
    (snapshot.isWeekend || snapshot.isActive || snapshot.awaitingActivation)
  );
};

export const loadScreamOfferVisibility = async (): Promise<boolean> => {
  const visible = await fetchScreamOfferVisibility();
  setScreamOfferApiVisibility(visible);
  return visible;
};
