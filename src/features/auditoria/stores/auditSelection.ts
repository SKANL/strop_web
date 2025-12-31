/**
 * Nano Store para gestión de selección de log
 * Controla qué log está seleccionado para mostrar en detalle
 */

import { atom } from "nanostores";

/**
 * ID del log seleccionado (null si ninguno)
 */
export const selectedLogIdStore = atom<string | null>(null);

/**
 * Estado del modal de detalle (abierto/cerrado)
 */
export const isDetailModalOpenStore = atom<boolean>(false);

/**
 * Selecciona un log y abre el modal
 */
export function selectLog(logId: string) {
  selectedLogIdStore.set(logId);
  isDetailModalOpenStore.set(true);
}

/**
 * Cierra el modal de detalle
 */
export function closeDetailModal() {
  isDetailModalOpenStore.set(false);
  // No limpiamos el selectedLogId inmediatamente para permitir animación de salida
  setTimeout(() => {
    selectedLogIdStore.set(null);
  }, 200);
}

/**
 * Limpia la selección
 */
export function clearSelection() {
  selectedLogIdStore.set(null);
  isDetailModalOpenStore.set(false);
}
