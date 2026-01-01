/**
 * Excel/CSV Parser Utility for Strop SaaS
 * Parses Excel and CSV files in the browser using SheetJS (xlsx)
 */

import * as XLSX from "xlsx";

export interface ParsedExcelData {
  headers: string[];
  rows: Record<string, unknown>[];
  previewRows: Record<string, unknown>[];
  totalRows: number;
  sheetName: string;
}

export interface ExcelParseOptions {
  previewRowCount?: number;
  sheetIndex?: number;
}

/**
 * Parses an Excel or CSV file and returns headers and data rows
 * Processing happens entirely in the browser (no server needed)
 */
export async function parseExcelFile(
  file: File,
  options: ExcelParseOptions = {}
): Promise<ParsedExcelData> {
  const { previewRowCount = 5, sheetIndex = 0 } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          throw new Error("No se pudo leer el archivo");
        }

        // Parse workbook
        const workbook = XLSX.read(data, { type: "array" });

        // Get first sheet or specified index
        const sheetNames = workbook.SheetNames;
        if (sheetIndex >= sheetNames.length) {
          throw new Error(`La hoja ${sheetIndex} no existe en el archivo`);
        }

        const sheetName = sheetNames[sheetIndex];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON with header row
        const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(
          worksheet,
          {
            defval: "", // Default value for empty cells
          }
        );

        if (jsonData.length === 0) {
          throw new Error("El archivo está vacío o no tiene datos válidos");
        }

        // Extract headers from first row keys
        const headers = Object.keys(jsonData[0]);

        // Get preview rows (first N rows for UI display)
        const previewRows = jsonData.slice(0, previewRowCount);

        resolve({
          headers,
          rows: jsonData,
          previewRows,
          totalRows: jsonData.length,
          sheetName,
        });
      } catch (error) {
        reject(
          error instanceof Error
            ? error
            : new Error("Error al procesar el archivo")
        );
      }
    };

    reader.onerror = () => {
      reject(new Error("Error al leer el archivo"));
    };

    // Read file as ArrayBuffer
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Gets all sheet names from an Excel file
 */
export async function getExcelSheetNames(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          throw new Error("No se pudo leer el archivo");
        }

        const workbook = XLSX.read(data, { type: "array" });
        resolve(workbook.SheetNames);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Error al leer el archivo"));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Validates that a file is a valid Excel or CSV file
 */
export function isValidExcelFile(file: File): boolean {
  const validExtensions = [".xlsx", ".xls", ".csv"];
  const fileName = file.name.toLowerCase();
  return validExtensions.some((ext) => fileName.endsWith(ext));
}

/**
 * Formats a cell value for display
 */
export function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (value instanceof Date) {
    return value.toLocaleDateString("es-MX");
  }

  if (typeof value === "number") {
    // Format numbers with locale
    return value.toLocaleString("es-MX");
  }

  return String(value);
}

/**
 * Attempts to parse a date string from Excel
 * Excel stores dates as serial numbers or ISO strings
 */
export function parseExcelDate(value: unknown): Date | null {
  if (!value) return null;

  // If it's already a Date
  if (value instanceof Date) {
    return value;
  }

  // If it's a number (Excel serial date)
  if (typeof value === "number") {
    // Excel serial date: days since January 1, 1900
    // Subtract 25569 to get Unix timestamp (days since 1970)
    const unixDays = value - 25569;
    const milliseconds = unixDays * 86400 * 1000;
    return new Date(milliseconds);
  }

  // If it's a string, try to parse it
  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }

    // Try common date formats
    // DD/MM/YYYY
    const ddmmyyyy = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (ddmmyyyy) {
      return new Date(
        parseInt(ddmmyyyy[3]),
        parseInt(ddmmyyyy[2]) - 1,
        parseInt(ddmmyyyy[1])
      );
    }

    // YYYY-MM-DD
    const yyyymmdd = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (yyyymmdd) {
      return new Date(
        parseInt(yyyymmdd[1]),
        parseInt(yyyymmdd[2]) - 1,
        parseInt(yyyymmdd[3])
      );
    }
  }

  return null;
}
