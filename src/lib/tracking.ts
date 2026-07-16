declare global {
  interface Window {
    fbq?: any;
    ttq?: any;
    gtag?: any;
  }
}

export const trackViewContent = (product: { id: string, name: string, price: number, currency: string }) => {
  if (typeof window === 'undefined') return;
  
  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value: product.price,
      currency: product.currency,
    });
  }
  
  if (window.ttq) {
    window.ttq.track('ViewContent', {
      contents: [{
        content_id: product.id,
        content_name: product.name,
        price: product.price,
        quantity: 1
      }],
      value: product.price,
      currency: product.currency,
    });
  }
  
  if (window.gtag) {
    window.gtag('event', 'view_item', {
      currency: product.currency,
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: 1
      }]
    });
  }
};

export const trackAddToCart = (product: { id: string, name: string, price: number, currency: string, quantity: number }) => {
  if (typeof window === 'undefined') return;
  
  if (window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value: product.price * product.quantity,
      currency: product.currency,
    });
  }
  
  if (window.ttq) {
    window.ttq.track('AddToCart', {
      contents: [{
        content_id: product.id,
        content_name: product.name,
        price: product.price,
        quantity: product.quantity
      }],
      value: product.price * product.quantity,
      currency: product.currency,
    });
  }
  
  if (window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: product.currency,
      value: product.price * product.quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity
      }]
    });
  }
};

export const trackInitiateCheckout = (total: number, currency: string, items: any[]) => {
  if (typeof window === 'undefined') return;
  
  if (window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      value: total,
      currency: currency,
      num_items: items.reduce((acc, item) => acc + item.quantity, 0),
    });
  }
  
  if (window.ttq) {
    window.ttq.track('InitiateCheckout', {
      value: total,
      currency: currency,
      contents: items.map(item => ({
        content_id: item.productId,
        content_name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    });
  }
  
  if (window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: currency,
      value: total,
      items: items.map(item => ({
        item_id: item.productId,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    });
  }
};

export const trackPurchase = (orderId: string, total: number, currency: string, items: any[]) => {
  if (typeof window === 'undefined') return;
  
  if (window.fbq) {
    window.fbq('track', 'Purchase', {
      value: total,
      currency: currency,
      content_ids: items.map(item => item.productId),
      content_type: 'product',
      order_id: orderId
    });
  }
  
  if (window.ttq) {
    window.ttq.track('CompletePayment', {
      value: total,
      currency: currency,
      order_id: orderId,
      contents: items.map(item => ({
        content_id: item.productId,
        content_name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    });
  }
  
  if (window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: orderId,
      value: total,
      currency: currency,
      items: items.map(item => ({
        item_id: item.productId,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    });
  }
};
