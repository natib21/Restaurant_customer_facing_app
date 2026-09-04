import { createContext, useState, useEffect, useMemo } from "react";

const BrandingContext = createContext();

const DEFAULTS = {
  primaryColor: '#10B981', // fallback primary color
  merchantName: 'Restaurant Menu',
  logoUrl: '/vite.svg',
};

function hexToRgb(hex) {
  if (!hex) return null;
  const clean = hex.replace('#', '').trim();
  const bigint = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

function rgbaFromHex(hex, alpha = 1) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

function applyCssVars({ primaryColor }) {
  try {
    const root = document.documentElement;
    const primary = primaryColor || '#10B981';
    root.style.setProperty('--color-primary', primary);
    // container default: slightly darker or same fallback
    root.style.setProperty('--color-primary-container', primary);
    // derived translucent/fixed variants
    root.style.setProperty('--color-primary-fixed', rgbaFromHex(primary, 0.12));
    root.style.setProperty('--color-primary-fixed-dim', rgbaFromHex(primary, 0.08));
  } catch (err) {
    // ignore server-side or DOM errors
  }
}

function BrandingProvider({ children }) {
  const [branding, setBrandingState] = useState(() => {
    try {
      const raw = localStorage.getItem('branding');
      return raw ? JSON.parse(raw) : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });

  useEffect(() => {
    applyCssVars(branding);
    try {
      localStorage.setItem('branding', JSON.stringify(branding));
    } catch {}
  }, [branding]);

  const setBranding = (partial) => {
    setBrandingState((prev) => ({ ...prev, ...partial }));
  };

  const value = useMemo(() => ({
    branding,
    setBranding,
    defaults: DEFAULTS,
  }), [branding]);

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  );
}

export { BrandingContext, BrandingProvider };
