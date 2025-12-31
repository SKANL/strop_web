import type { Material } from "./types";

export const mockMaterials: Material[] = [
  {
    id: "mat-1",
    organizationId: "org-1",
    projectId: "proj-1",
    name: "Cemento Portland",
    unit: "ton",
    plannedQuantity: 50,
    requestedQuantity: 35,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-12-20T15:30:00Z",
  },
  {
    id: "mat-2",
    organizationId: "org-1",
    projectId: "proj-1",
    name: "Varilla 3/8\"",
    unit: "ton",
    plannedQuantity: 20,
    requestedQuantity: 22, // DESVIACIÓN: 22 > 20
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-12-25T09:15:00Z",
  },
  {
    id: "mat-3",
    organizationId: "org-1",
    projectId: "proj-1",
    name: "Arena de Río",
    unit: "m3",
    plannedQuantity: 100,
    requestedQuantity: 45,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-12-10T11:20:00Z",
  },
  {
    id: "mat-4",
    organizationId: "org-1",
    projectId: "proj-1",
    name: "Grava 3/4\"",
    unit: "m3",
    plannedQuantity: 80,
    requestedQuantity: 78, // Casi al límite
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-12-28T14:45:00Z",
  },
  {
    id: "mat-5",
    organizationId: "org-1",
    projectId: "proj-1",
    name: "Ladrillo Rojo Recocido",
    unit: "millar",
    plannedQuantity: 15,
    requestedQuantity: 5,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-12-05T08:30:00Z",
  }
];
