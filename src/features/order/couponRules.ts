export type CouponEvaluationStatus = 'none' | 'applied' | 'invalid';

export interface CouponRule {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderAmount: number;
  appliesOn: 'subtotal_excluding_delivery';
  isActive: boolean;
}

export interface CouponEvaluationResult {
  status: CouponEvaluationStatus;
  code: string | null;
  discountAmount: number;
  message: string;
}

interface CouponEvaluationContext {
  subtotalExcludingDelivery: number;
}

const COUPON_RULES: CouponRule[] = [
  {
    code: 'FIRST10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 1000,
    appliesOn: 'subtotal_excluding_delivery',
    isActive: true
  }
];

const EMPTY_RESULT: CouponEvaluationResult = {
  status: 'none',
  code: null,
  discountAmount: 0,
  message: ''
};

export const normalizeCouponCode = (value: string): string => value.trim().toUpperCase();

export const evaluateCoupon = (couponCode: string, context: CouponEvaluationContext): CouponEvaluationResult => {
  const normalizedCode = normalizeCouponCode(couponCode);
  if (!normalizedCode) {
    return EMPTY_RESULT;
  }

  const rule = COUPON_RULES.find((item) => item.isActive && item.code === normalizedCode);
  if (!rule) {
    return {
      status: 'invalid',
      code: normalizedCode,
      discountAmount: 0,
      message: 'Invalid coupon code.'
    };
  }

  if (context.subtotalExcludingDelivery < rule.minOrderAmount) {
    return {
      status: 'invalid',
      code: normalizedCode,
      discountAmount: 0,
      message: `Minimum order of INR ${rule.minOrderAmount} is required for ${rule.code}.`
    };
  }

  const discountBase = context.subtotalExcludingDelivery;
  const discountAmount =
    rule.discountType === 'percentage'
      ? Math.round((discountBase * rule.discountValue) / 100)
      : rule.discountValue;

  return {
    status: 'applied',
    code: normalizedCode,
    discountAmount: Math.min(discountAmount, discountBase),
    message: `${rule.code} applied successfully.`
  };
};

