/**
 * Shipping constants — single source of truth for the whole app.
 * Update these values here to change shipping logic everywhere.
 */
export const DELIVERY_FEE = 270;            // PKR — charged when subtotal < FREE_SHIPPING_THRESHOLD
export const FREE_SHIPPING_THRESHOLD = 10000; // PKR — orders at or above this get free shipping

/**
 * Calculate the shipping fee for a given subtotal.
 */
export function calcShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DELIVERY_FEE;
}
