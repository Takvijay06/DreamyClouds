import { useEffect, useState } from 'react';

const TRENDING_TAB_LABEL = 'Trending';
const MOTHERS_DAY_TAB_LABEL = "Mother's Day Special";
const ROTATE_MS = 2000;

export type AlternatingTrendingTabLabelState = {
  label: string;
  /** True while the tab title shows Mother's Day Special — use for attention animations. */
  isMothersDaySpecial: boolean;
};

/** Alternates the first trending-tab label every 2s (Trending ↔ Mother's Day Special). */
export function useAlternatingTrendingTabLabel(): AlternatingTrendingTabLabelState {
  const [showMothersDay, setShowMothersDay] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      setShowMothersDay((prev) => !prev);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  return {
    label: showMothersDay ? MOTHERS_DAY_TAB_LABEL : TRENDING_TAB_LABEL,
    isMothersDaySpecial: showMothersDay
  };
}
