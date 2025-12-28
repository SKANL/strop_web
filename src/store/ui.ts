import { persistentAtom } from '@nanostores/persistent';

export type Theme = 'light' | 'dark' | 'system';

// Persistent atoms for UI state so preferences survive reloads
// 'strop:sidebar' is the key in localStorage
export const isSidebarCollapsed = persistentAtom<boolean>('strop:sidebar', false, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const isRightSidebarOpen = persistentAtom<boolean>('strop:rightSidebar', false, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

// Mobile menu often doesn't need persistence, but consistency is fine. 
// However, typically you want it closed on reload on mobile.
// So we keep this one as a regular atom or non-persistent.
import { atom } from 'nanostores';
export const isMobileMenuOpen = atom<boolean>(false);

// Actions
export function toggleSidebar() {
  isSidebarCollapsed.set(!isSidebarCollapsed.get());
}

export function setSidebarCollapsed(value: boolean) {
  isSidebarCollapsed.set(value);
}

export function toggleMobileMenu() {
  isMobileMenuOpen.set(!isMobileMenuOpen.get());
}

export function toggleRightSidebar() {
  isRightSidebarOpen.set(!isRightSidebarOpen.get());
}
