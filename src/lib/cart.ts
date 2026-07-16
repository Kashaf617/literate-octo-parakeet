// Cart storage utility using localStorage for multi-item support
export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  variant: string;
}

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('cart');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    // Handle legacy single-item object migration
    if (parsed && typeof parsed === 'object' && parsed.id) {
      const migrated = [{
        id: parsed.id,
        name: parsed.name || "Product",
        price: Number(parsed.price || 0),
        qty: Number(parsed.qty || 1),
        image: parsed.image || "/placeholder.png",
        variant: parsed.variant || ""
      }];
      localStorage.setItem('cart', JSON.stringify(migrated));
      return migrated;
    }
    return [];
  } catch {
    return [];
  }
}

export function addToCart(item: Omit<CartItem, 'qty'> & { qty?: number }): CartItem[] {
  if (typeof window === 'undefined') return [];
  const list = getCart();
  const qtyToAdd = item.qty || 1;
  const existing = list.find((i) => i.id === item.id && i.variant === item.variant);
  
  if (existing) {
    existing.qty += qtyToAdd;
  } else {
    list.push({ ...item, qty: qtyToAdd });
  }
  
  localStorage.setItem('cart', JSON.stringify(list));
  window.dispatchEvent(new Event('cart-update'));
  return list;
}

export function removeFromCart(id: string, variant: string): CartItem[] {
  if (typeof window === 'undefined') return [];
  let list = getCart();
  list = list.filter((i) => !(i.id === id && i.variant === variant));
  
  localStorage.setItem('cart', JSON.stringify(list));
  window.dispatchEvent(new Event('cart-update'));
  return list;
}

export function updateCartQty(id: string, variant: string, qty: number): CartItem[] {
  if (typeof window === 'undefined') return [];
  const list = getCart();
  const item = list.find((i) => i.id === id && i.variant === variant);
  
  if (item) {
    item.qty = Math.max(1, qty);
    localStorage.setItem('cart', JSON.stringify(list));
    window.dispatchEvent(new Event('cart-update'));
  }
  return list;
}

export function clearCart(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('cart');
  window.dispatchEvent(new Event('cart-update'));
}
