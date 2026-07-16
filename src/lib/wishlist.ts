// Wishlist storage utility using localStorage
export interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  images: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  status: string;
}

export function getWishlist(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('wishlist') || '[]');
  } catch {
    return [];
  }
}

export function toggleWishlist(product: WishlistItem): boolean {
  if (typeof window === 'undefined') return false;
  const list = getWishlist();
  const index = list.findIndex((item) => item.id === product.id);
  let added = false;
  
  if (index > -1) {
    list.splice(index, 1);
  } else {
    list.push(product);
    added = true;
  }
  
  localStorage.setItem('wishlist', JSON.stringify(list));
  window.dispatchEvent(new Event('wishlist-update'));
  return added;
}

export function isWishlisted(productId: string): boolean {
  if (typeof window === 'undefined') return false;
  const list = getWishlist();
  return list.some((item) => item.id === productId);
}
