export const DISCOUNT_CODE = 'DINE10';

const money = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function calculateCheckout(
    subtotal: number,
    couponInput: unknown,
    tipInput: unknown,
    gstRate: number,
    sgstRate: number,
    packagingCharge = 0,
) {
    if (!Number.isFinite(subtotal) || subtotal < 0) {
        throw new Error('Invalid order amount');
    }

    if (couponInput != null && typeof couponInput !== 'string') {
        throw new Error('Invalid discount code');
    }
    const couponCode = (couponInput || '').trim().toUpperCase();
    if (couponCode && couponCode !== DISCOUNT_CODE) {
        throw new Error('That discount code is not valid');
    }

    const tipAmount = tipInput == null ? 0 : tipInput;
    if (typeof tipAmount !== 'number' || !Number.isFinite(tipAmount) || tipAmount < 0 || tipAmount > 10000) {
        throw new Error('Tip must be between ₹0 and ₹10,000');
    }
    if (!Number.isFinite(packagingCharge) || packagingCharge < 0 || packagingCharge > 10000) {
        throw new Error('Invalid packaging charge');
    }

    const discountAmount = couponCode ? money(subtotal * 0.1) : 0;
    const taxableSubtotal = money(subtotal - discountAmount);
    const appliedGstRate = Math.max(0, Number(gstRate) || 0);
    const appliedSgstRate = Math.max(0, Number(sgstRate) || 0);
    const gstAmount = money(taxableSubtotal * appliedGstRate / 100);
    const sgstAmount = money(taxableSubtotal * appliedSgstRate / 100);

    return {
        couponCode,
        discountAmount,
        tipAmount: money(tipAmount),
        packagingCharge: money(packagingCharge),
        gstRate: appliedGstRate,
        sgstRate: appliedSgstRate,
        gstAmount,
        sgstAmount,
        payableAmount: money(taxableSubtotal + gstAmount + sgstAmount + tipAmount + packagingCharge),
        preparedAt: new Date(),
    };
}
