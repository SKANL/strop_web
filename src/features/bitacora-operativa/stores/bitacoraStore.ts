/**
 * Nano Store for Bitácora Operativa state management
 * Handles selection, filters, and modal state
 */

import { atom, computed } from 'nanostores';
import type { BitacoraFilterState, LogCategory, LogStatus, OperationalLog } from '../types';

// ============================================
// SELECTION STATE
// ============================================

/** IDs of logs selected for official composer */
export const $selectedLogIds = atom<string[]>([]);

/** Currently viewed log detail (Sheet) */
export const $detailLogId = atom<string | null>(null);

/** Is composer panel open */
export const $isComposerOpen = atom(true);

// ============================================
// COMPUTED
// ============================================

/** Count of selected logs */
export const $selectedCount = computed($selectedLogIds, (ids) => ids.length);

// ============================================
// FILTER STATE
// ============================================

const defaultFilters: BitacoraFilterState = {
  search: '',
  category: [],
  dateRange: null,
  project: [],
  author: [],
  status: [],
};

export const $filters = atom<BitacoraFilterState>(defaultFilters);

// ============================================
// ACTIONS
// ============================================

export function toggleSelection(id: string) {
  const current = $selectedLogIds.get();
  $selectedLogIds.set(
    current.includes(id) 
      ? current.filter(x => x !== id)
      : [...current, id]
  );
}

export function clearSelection() {
  $selectedLogIds.set([]);
}

export function openDetail(id: string) {
  $detailLogId.set(id);
}

export function closeDetail() {
  $detailLogId.set(null);
}

export function toggleComposer() {
  $isComposerOpen.set(!$isComposerOpen.get());
}

export function updateFilters(partial: Partial<BitacoraFilterState>) {
  $filters.set({ ...$filters.get(), ...partial });
}

export function clearFilters() {
  $filters.set(defaultFilters);
}

export function toggleCategoryFilter(category: LogCategory) {
  const current = $filters.get().category;
  updateFilters({
    category: current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category]
  });
}

export function toggleStatusFilter(status: LogStatus) {
  const current = $filters.get().status;
  updateFilters({
    status: current.includes(status)
      ? current.filter(s => s !== status)
      : [...current, status]
  });
}
