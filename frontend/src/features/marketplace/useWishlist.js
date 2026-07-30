import { useCallback, useEffect, useState } from 'react';

const WISHLIST_KEY = 'incampus_wishlist';
const WISHLIST_EVENT = 'incampus:wishlist';

function readWishlist() {
  try {
    const raw = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
    return Array.isArray(raw) ? raw.map(String) : [];
  } catch {
    return [];
  }
}

function writeWishlist(ids) {
  const next = ids.map(String);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(WISHLIST_EVENT, { detail: next }));
  return next;
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState(() => readWishlist());

  useEffect(() => {
    const sync = () => setWishlist(readWishlist());
    window.addEventListener(WISHLIST_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(WISHLIST_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const isWished = useCallback(
    (id) => wishlist.includes(String(id)),
    [wishlist]
  );

  const toggle = useCallback((id) => {
    const key = String(id);
    setWishlist((prev) => {
      const set = new Set(prev.map(String));
      if (set.has(key)) set.delete(key);
      else set.add(key);
      return writeWishlist(Array.from(set));
    });
  }, []);

  return { wishlist, isWished, toggle, count: wishlist.length };
}
