import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import {
  activateScreamOfferWindow,
  formatScreamOfferCountdown,
  getScreamOfferSnapshot,
  revealScreamOfferDiscount,
  SCREAM_INTERACTION_MS,
  SCREAM_INTERACTION_SECONDS,
  SCREAM_OFFER_DISCOUNT_PERCENT,
  subscribeScreamOffer
} from '../utils/tumblerScreamOffer';
import {
  readScreamHighFrequencyLevel,
  ScreamMicSession,
  startScreamMicrophone,
  stopScreamMicrophone
} from '../utils/screamAudioAnalysis';
import { ScreamTumblerVisual } from './ScreamTumblerVisual';

type ModalPhase = 'screaming' | 'revealed' | 'active' | 'expired';

const ScreamOfferActiveCard = ({ countdown }: { countdown: string }) => (
  <div className="scream-offer-active-card">
    <ScreamTumblerVisual fillPercent={100} isListening={false} isUnlocked finalDiscountPercent={SCREAM_OFFER_DISCOUNT_PERCENT} />
    <p className="scream-offer-active-label">Offer active</p>
    <p className="scream-offer-discount-badge" aria-label={`${SCREAM_OFFER_DISCOUNT_PERCENT} percent off`}>
      {SCREAM_OFFER_DISCOUNT_PERCENT}
      <span>% OFF</span>
    </p>
    <p className="scream-offer-timer-label">Apply in cart within</p>
    <p className="scream-offer-countdown">{countdown}</p>
    <p className="scream-offer-active-hint">
      Your discount is live in the cart. Complete checkout before the timer ends.
    </p>
  </div>
);

const ScreamOfferRevealedCard = () => (
  <div className="scream-offer-active-card">
    <ScreamTumblerVisual fillPercent={100} isListening={false} isUnlocked finalDiscountPercent={SCREAM_OFFER_DISCOUNT_PERCENT} />
    <p className="scream-offer-active-label">Your final discount</p>
    <p className="scream-offer-discount-badge" aria-label={`${SCREAM_OFFER_DISCOUNT_PERCENT} percent off`}>
      {SCREAM_OFFER_DISCOUNT_PERCENT}
      <span>% OFF</span>
    </p>
    <p className="scream-offer-active-hint">
      Close this window to start your 10-minute offer timer and apply the discount in your cart.
    </p>
  </div>
);

const resolvePhaseFromSnapshot = (snapshot: ReturnType<typeof getScreamOfferSnapshot>): ModalPhase | 'start-scream' => {
  if (snapshot.isActive) {
    return 'active';
  }
  if (snapshot.awaitingActivation) {
    return 'revealed';
  }
  if (snapshot.hasScreamedToday) {
    return 'expired';
  }
  return 'start-scream';
};

export const TumblerScreamOffer = () => {
  const snapshot = useSyncExternalStore(subscribeScreamOffer, getScreamOfferSnapshot, getScreamOfferSnapshot);
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<ModalPhase | 'start-scream'>('start-scream');
  const [secondsLeft, setSecondsLeft] = useState(SCREAM_INTERACTION_SECONDS);
  const [fillPercent, setFillPercent] = useState(12);
  const [liveDiscountPercent, setLiveDiscountPercent] = useState(0);
  const screamTimerRef = useRef<number | null>(null);
  const screamRafRef = useRef<number | null>(null);
  const screamMicRef = useRef<ScreamMicSession | null>(null);
  const screamLevelRef = useRef(0);
  const screamStartedAtRef = useRef<number | null>(null);

  const stopScreamMicrophoneSession = useCallback(() => {
    stopScreamMicrophone(screamMicRef.current);
    screamMicRef.current = null;
  }, []);

  const clearScreamAnimation = useCallback(() => {
    if (screamRafRef.current !== null) {
      cancelAnimationFrame(screamRafRef.current);
      screamRafRef.current = null;
    }
    stopScreamMicrophoneSession();
    screamLevelRef.current = 0;
  }, [stopScreamMicrophoneSession]);

  const clearScreamTimer = useCallback(() => {
    if (screamTimerRef.current !== null) {
      window.clearInterval(screamTimerRef.current);
      screamTimerRef.current = null;
    }
    screamStartedAtRef.current = null;
    clearScreamAnimation();
  }, [clearScreamAnimation]);

  useEffect(() => () => clearScreamTimer(), [clearScreamTimer]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const startScreamAudioLoop = useCallback(() => {
    const tick = () => {
      const session = screamMicRef.current;
      if (!session) {
        screamRafRef.current = requestAnimationFrame(tick);
        return;
      }

      const rawLevel = readScreamHighFrequencyLevel(session);
      const smoothed = screamLevelRef.current * 0.72 + rawLevel * 0.28;
      screamLevelRef.current = smoothed;

      const visualFill = 12 + smoothed * 88;
      const discountPercent = Math.min(
        SCREAM_OFFER_DISCOUNT_PERCENT,
        Math.round(smoothed * SCREAM_OFFER_DISCOUNT_PERCENT)
      );

      setFillPercent((current) => Math.max(current, visualFill));
      setLiveDiscountPercent((current) => Math.max(current, discountPercent));

      screamRafRef.current = requestAnimationFrame(tick);
    };

    screamRafRef.current = requestAnimationFrame(tick);
  }, []);

  const startScreamCountdown = useCallback(() => {
    clearScreamTimer();
    setPhase('screaming');
    setSecondsLeft(SCREAM_INTERACTION_SECONDS);
    setFillPercent(12);
    setLiveDiscountPercent(0);
    screamLevelRef.current = 0;
    screamStartedAtRef.current = Date.now();

    void startScreamMicrophone().then((session) => {
      screamMicRef.current = session;
      if (session) {
        startScreamAudioLoop();
      }
    });

    screamTimerRef.current = window.setInterval(() => {
      const startedAt = screamStartedAtRef.current;
      if (startedAt === null) {
        return;
      }

      const elapsed = Date.now() - startedAt;
      const remainingMs = Math.max(0, SCREAM_INTERACTION_MS - elapsed);
      const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));

      setSecondsLeft(remainingSeconds);

      if (remainingMs <= 0) {
        clearScreamTimer();
        setPhase('revealed');
        setFillPercent(100);
        setLiveDiscountPercent(SCREAM_OFFER_DISCOUNT_PERCENT);
        window.setTimeout(() => {
          revealScreamOfferDiscount();
        }, 0);
      }
    }, 100);
  }, [clearScreamTimer, startScreamAudioLoop]);

  const handleOpen = () => {
    const nextPhase = resolvePhaseFromSnapshot(snapshot);
    setOpen(true);
    setPhase(nextPhase);

    if (nextPhase === 'start-scream') {
      startScreamCountdown();
    }
  };

  const canDismiss = phase === 'revealed' || phase === 'active' || phase === 'expired';

  const handleClose = () => {
    if (!canDismiss) {
      return;
    }

    if (phase === 'revealed' || snapshot.awaitingActivation) {
      activateScreamOfferWindow();
    }

    clearScreamTimer();
    setOpen(false);
  };

  if (!snapshot.isOfferVisible) {
    return null;
  }

  if (!snapshot.isWeekend && !snapshot.isActive && !snapshot.awaitingActivation) {
    return null;
  }

  const offerCountdown = formatScreamOfferCountdown(snapshot.remainingMs);

  const pillLabel = snapshot.isActive
    ? `${SCREAM_OFFER_DISCOUNT_PERCENT}% off expires in ${offerCountdown}, Order Fast`
    : snapshot.awaitingActivation
      ? 'Discount ready — tap to activate'
      : 'Weekend Tumbler Scream';

  const modalContent =
    phase === 'active' ? (
      <>
        <p className="scream-offer-copy">Your {SCREAM_OFFER_DISCOUNT_PERCENT}% discount is active in the cart.</p>
        <ScreamOfferActiveCard countdown={offerCountdown} />
      </>
    ) : phase === 'revealed' ? (
      <>
        <p className="scream-offer-copy">Time&apos;s up — here&apos;s your final discount!</p>
        <ScreamOfferRevealedCard />
      </>
    ) : phase === 'expired' ? (
      <div className="scream-offer-note scream-offer-note-muted">
        {snapshot.redeemed
          ? 'You used today\'s scream offer at checkout. Come back tomorrow to scream again.'
          : 'Today\'s scream offer has ended. You can try again tomorrow.'}
      </div>
    ) : (
      <>
        <p className="scream-offer-copy">
          Scream into your mic — high-pitched screams fill the tumbler (up to{' '}
          <strong>{SCREAM_OFFER_DISCOUNT_PERCENT}%</strong>) before the timer ends in{' '}
          <strong>{secondsLeft}s</strong>.
        </p>
        <ScreamTumblerVisual
          fillPercent={fillPercent}
          isListening
          isUnlocked={false}
          showcasePercent={liveDiscountPercent}
        />
        <p className="scream-offer-scream-countdown" aria-live="polite">
          {secondsLeft}
        </p>
        <p className="scream-offer-meter-label">
          {liveDiscountPercent > 0
            ? `${liveDiscountPercent}% — keep screaming to max out!`
            : 'Scream sharply — low air and breath sounds won\u2019t fill the tumbler'}
        </p>
        <div className="scream-offer-meter" aria-hidden="true">
          <div className="scream-offer-meter-fill" style={{ width: `${fillPercent}%` }} />
        </div>
      </>
    );

  const modal =
    open && typeof document !== 'undefined'
      ? createPortal(
          <div className="scream-offer-modal" role="dialog" aria-modal="true" aria-labelledby="scream-offer-title">
            {canDismiss ? (
              <button type="button" className="scream-offer-backdrop" aria-label="Close scream offer" onClick={handleClose} />
            ) : (
              <div className="scream-offer-backdrop scream-offer-backdrop-locked" aria-hidden="true" />
            )}
            <div className="scream-offer-panel">
              <div className="scream-offer-panel-glow" aria-hidden="true" />
              <button
                type="button"
                className={`scream-offer-close ${canDismiss ? '' : 'scream-offer-close-hidden'}`}
                onClick={handleClose}
                aria-label="Close"
                aria-hidden={!canDismiss}
                tabIndex={canDismiss ? 0 : -1}
              >
                ×
              </button>

              <p className="scream-offer-kicker">Weekend only · Once daily · {SCREAM_INTERACTION_SECONDS}s scream · 10 min to checkout</p>
              <h2 id="scream-offer-title" className="scream-offer-title">
                Scream for Tumblers
              </h2>
              {modalContent}
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div className="scream-offer-pill-wrap">
        <button type="button" className="scream-offer-pill" onClick={handleOpen}>
          <span aria-hidden="true">{'\u{1F3A4}'}</span>
          <span>{pillLabel}</span>
        </button>
      </div>
      {modal}
    </>
  );
};
