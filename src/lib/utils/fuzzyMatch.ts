/**
 * Fuzzy Matching Utility for Smart Column Mapping
 * Uses Fuse.js for intelligent column name suggestions
 */

import Fuse from "fuse.js";

/**
 * Target field definition for mapping
 */
export interface TargetField {
  key: string;
  label: string;
  aliases: string[]; // Common names this field might have in source files
  required: boolean;
  type: "string" | "date" | "number" | "enum";
}

/**
 * Suggested mapping result
 */
export interface MappingSuggestion {
  sourceColumn: string;
  targetField: TargetField | null;
  confidence: number; // 0-100
  isAutoMatched: boolean;
}

/**
 * Target fields for Critical Path (Ruta Crítica) import
 */
export const criticalPathFields: TargetField[] = [
  {
    key: "activity_name",
    label: "Actividad / Concepto",
    aliases: [
      "actividad",
      "concepto",
      "descripcion",
      "descripción",
      "activity",
      "name",
      "nombre",
      "partida",
      "tarea",
      "item",
      "clave",
      "cve",
    ],
    required: true,
    type: "string",
  },
  {
    key: "planned_start",
    label: "Fecha Inicio",
    aliases: [
      "fecha inicio",
      "inicio",
      "start",
      "start date",
      "fecha_inicio",
      "fechainicio",
      "comienzo",
      "inicia",
      "fi",
    ],
    required: true,
    type: "date",
  },
  {
    key: "planned_end",
    label: "Fecha Fin",
    aliases: [
      "fecha fin",
      "fin",
      "end",
      "end date",
      "fecha_fin",
      "fechafin",
      "termino",
      "término",
      "finaliza",
      "ff",
    ],
    required: true,
    type: "date",
  },
  {
    key: "progress_percentage",
    label: "% Avance",
    aliases: [
      "avance",
      "progreso",
      "progress",
      "porcentaje",
      "%",
      "% avance",
      "% completado",
      "completado",
    ],
    required: false,
    type: "number",
  },
  {
    key: "status",
    label: "Estado",
    aliases: ["estado", "status", "estatus", "situacion", "situación"],
    required: false,
    type: "enum",
  },
  {
    key: "duration_days",
    label: "Duración (días)",
    aliases: [
      "duracion",
      "duración",
      "duration",
      "dias",
      "días",
      "days",
      "dur",
    ],
    required: false,
    type: "number",
  },
  {
    key: "responsible",
    label: "Responsable",
    aliases: [
      "responsable",
      "encargado",
      "asignado",
      "assignee",
      "assigned",
      "owner",
    ],
    required: false,
    type: "string",
  },
];

/**
 * Target fields for Materials (Explosión de Insumos) import
 */
export const materialsFields: TargetField[] = [
  {
    key: "sku",
    label: "Clave / SKU",
    aliases: [
      "clave",
      "cve",
      "codigo",
      "código",
      "sku",
      "code",
      "id",
      "cve insumo",
      "clave insumo",
    ],
    required: true,
    type: "string",
  },
  {
    key: "name",
    label: "Descripción / Nombre",
    aliases: [
      "descripcion",
      "descripción",
      "nombre",
      "name",
      "material",
      "insumo",
      "concepto",
      "desc",
    ],
    required: true,
    type: "string",
  },
  {
    key: "unit",
    label: "Unidad",
    aliases: ["unidad", "unit", "u", "um", "uom", "medida", "und"],
    required: true,
    type: "string",
  },
  {
    key: "planned_quantity",
    label: "Cantidad Planeada",
    aliases: [
      "cantidad",
      "qty",
      "quantity",
      "cant",
      "cant.",
      "planeada",
      "planned",
      "presupuesto",
      "presupuestada",
    ],
    required: true,
    type: "number",
  },
  {
    key: "unit_price",
    label: "Precio Unitario",
    aliases: [
      "precio",
      "price",
      "pu",
      "p.u.",
      "costo",
      "cost",
      "unitario",
      "unit price",
    ],
    required: false,
    type: "number",
  },
  {
    key: "category",
    label: "Categoría",
    aliases: [
      "categoria",
      "categoría",
      "category",
      "tipo",
      "type",
      "grupo",
      "familia",
    ],
    required: false,
    type: "string",
  },
];

/**
 * Normalize a string for comparison (lowercase, no accents, trim)
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s]/g, "") // Remove special chars
    .trim();
}

/**
 * Suggests the best mapping for source columns to target fields
 * Uses Fuse.js for fuzzy matching with aliases
 */
export function suggestMapping(
  sourceColumns: string[],
  targetFields: TargetField[]
): MappingSuggestion[] {
  // Build a searchable list with all aliases
  const searchableItems = targetFields.flatMap((field) => [
    { text: field.label, field },
    { text: field.key, field },
    ...field.aliases.map((alias) => ({ text: alias, field })),
  ]);

  // Configure Fuse.js for fuzzy matching
  const fuse = new Fuse(searchableItems, {
    keys: ["text"],
    threshold: 0.4, // Lower = stricter matching
    includeScore: true,
    ignoreLocation: true,
  });

  // Track which target fields have been mapped
  const usedTargetKeys = new Set<string>();

  // Generate suggestions for each source column
  const suggestions: MappingSuggestion[] = sourceColumns.map((sourceColumn) => {
    const normalizedSource = normalizeString(sourceColumn);

    // Search for best match
    const results = fuse.search(normalizedSource);

    // Find best unused match
    const bestMatch = results.find(
      (r) => !usedTargetKeys.has(r.item.field.key)
    );

    if (bestMatch && bestMatch.score !== undefined) {
      // Convert Fuse score (0 = perfect, 1 = worst) to confidence (0-100)
      const confidence = Math.round((1 - bestMatch.score) * 100);

      // Mark as used if confidence is high enough
      if (confidence >= 50) {
        usedTargetKeys.add(bestMatch.item.field.key);
      }

      return {
        sourceColumn,
        targetField: confidence >= 50 ? bestMatch.item.field : null,
        confidence,
        isAutoMatched: confidence >= 70,
      };
    }

    return {
      sourceColumn,
      targetField: null,
      confidence: 0,
      isAutoMatched: false,
    };
  });

  return suggestions;
}

/**
 * Validates that all required fields are mapped
 */
export function validateMapping(
  suggestions: MappingSuggestion[],
  targetFields: TargetField[]
): { isValid: boolean; missingFields: TargetField[] } {
  const mappedKeys = new Set(
    suggestions
      .filter((s) => s.targetField !== null)
      .map((s) => s.targetField!.key)
  );

  const requiredFields = targetFields.filter((f) => f.required);
  const missingFields = requiredFields.filter((f) => !mappedKeys.has(f.key));

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Transforms source data using the confirmed mapping
 */
export function transformDataWithMapping<T extends Record<string, unknown>>(
  rows: Record<string, unknown>[],
  mapping: Map<string, string> // sourceColumn -> targetKey
): T[] {
  return rows.map((row) => {
    const transformed: Record<string, unknown> = {};

    mapping.forEach((targetKey, sourceColumn) => {
      if (sourceColumn in row) {
        transformed[targetKey] = row[sourceColumn];
      }
    });

    return transformed as T;
  });
}
