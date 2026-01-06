/**
 * LuckySheet Mapper Component
 * Fullscreen dialog for visual Excel/CSV mapping using LuckySheet
 * Based on reference implementation, adapted to Shadcn UI
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import {
  Upload,
  X,
  FileSpreadsheet,
  MousePointerClick,
  Save,
  Trash2,
  Loader2,
  RefreshCw,
  Copy,
  Code,
  Pencil,
  Tag,
  Database,
  Target,
  ChevronsDown,
  Wand2,
  Settings2,
  PanelRightClose,
  Table as TableIcon,
  Columns,
  Link,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { initLuckysheetDeps } from "@/lib/utils/loadLuckysheet";

// --- TYPES ---
type DataType = "string" | "number" | "date" | "boolean" | "list" | "derived";
type AggregateOperation = "sum" | "avg" | "max" | "min" | "count";
type ImportType = "materials" | "critical_path";

interface MappedField {
  id: string;
  key: string;
  label: string;
  type: DataType;
  sheetName: string;
  r1: number;
  c1: number;
  r2: number;
  c2: number;
  previewValue: any;
  labelR?: number;
  labelC?: number;
  labelPreview?: string;
  // For derived/aggregate fields
  relatedTo?: string;  // Key of the list field this is associated with
  operation?: AggregateOperation;  // Type of aggregation
}

interface LuckySheetMapperProps {
  type: ImportType;
  projectId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (data: Record<string, unknown>[]) => void;
}

// --- HELPER FUNCTIONS ---
const sanitizeKey = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_");

const getColLetter = (n: number) => {
  let s = "";
  while (n >= 0) {
    s = String.fromCharCode((n % 26) + 65) + s;
    n = Math.floor(n / 26) - 1;
  }
  return s;
};

const getAddress = (r1: number, c1: number, r2?: number, c2?: number) => {
  let addr = `${getColLetter(c1)}${r1 + 1}`;
  if (r2 !== undefined && c2 !== undefined && (r1 !== r2 || c1 !== c2)) {
    addr += `:${getColLetter(c2)}${r2 + 1}`;
  }
  return addr;
};

// --- MAIN COMPONENT ---
export function LuckySheetMapper({
  type,
  projectId,
  isOpen,
  onOpenChange,
  onSuccess,
}: LuckySheetMapperProps) {
  const [isReady, setIsReady] = useState(false);
  const [fileLoaded, setFileLoaded] = useState(false);
  const [mappedFields, setMappedFields] = useState<MappedField[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Editor State
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState<DataType>("string");
  const [fieldKey, setFieldKey] = useState("");
  const [fieldRelatedTo, setFieldRelatedTo] = useState<string>("");  // For derived fields
  const [fieldOperation, setFieldOperation] = useState<AggregateOperation>("sum");  // For derived fields

  const [draftLabel, setDraftLabel] = useState<{
    r: number;
    c: number;
    v: any;
  } | null>(null);
  const [draftValue, setDraftValue] = useState<{
    r1: number;
    c1: number;
    r2: number;
    c2: number;
    v: any;
  } | null>(null);
  const [selectionMode, setSelectionMode] = useState<"none" | "label" | "value">(
    "none"
  );
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

  const [excelData, setExcelData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"mapping" | "preview">("mapping");

  // JSON Structure options
  const [jsonStructure, setJsonStructure] = useState<"columns" | "table">("table");
  const [mainListKey, setMainListKey] = useState("items");

  // Refs for async callbacks
  const mappedFieldsRef = useRef<MappedField[]>([]);
  const selectionModeRef = useRef<"none" | "label" | "value">("none");
  const editingFieldIdRef = useRef<string | null>(null);

  useEffect(() => {
    mappedFieldsRef.current = mappedFields;
  }, [mappedFields]);
  useEffect(() => {
    selectionModeRef.current = selectionMode;
  }, [selectionMode]);
  useEffect(() => {
    editingFieldIdRef.current = editingFieldId;
  }, [editingFieldId]);

  // --- EXTRACTION LOGIC ---
  const extractValueFromRange = (
    r1: number,
    c1: number,
    r2: number,
    c2: number
  ) => {
    if (!window.luckysheet) return null;
    if (r1 === r2 && c1 === c2) {
      return window.luckysheet.getCellValue(r1, c1);
    }
    const values = [];
    for (let r = r1; r <= r2; r++) {
      for (let c = c1; c <= c2; c++) {
        const v = window.luckysheet.getCellValue(r, c);
        if (v !== null && v !== "") values.push(v);
      }
    }
    return values;
  };

  const processSelection = (
    r1: number,
    c1: number,
    r2: number,
    c2: number,
    mode: "label" | "value" | "none"
  ) => {
    const val = extractValueFromRange(r1, c1, r2, c2);

    if (mode === "label") {
      const labelVal = window.luckysheet.getCellValue(r1, c1);
      setDraftLabel({ r: r1, c: c1, v: labelVal });

      const text = String(labelVal || "").trim();
      if (text) {
        setFieldName(text);
        if (!editingFieldIdRef.current) setFieldKey(sanitizeKey(text));
        toast.info(`Título "${text}" capturado`);
      } else {
        toast.error("Celda vacía, por favor selecciona una con texto");
      }
      setSelectionMode("none");
    } else if (mode === "value") {
      setDraftValue({ r1, c1, r2, c2, v: val });

      let detectedType: DataType = "string";
      if (r1 !== r2 || c1 !== c2 || Array.isArray(val)) detectedType = "list";
      else if (typeof val === "number") detectedType = "number";
      else if (typeof val === "boolean") detectedType = "boolean";

      setFieldType(detectedType);
      setSelectionMode("none");
    } else {
      // 'none' mode -> Check if editing existing field
      if (!editingFieldIdRef.current) {
        const existing = mappedFieldsRef.current.find(
          (f) =>
            (f.r1 === r1 && f.c1 === c1 && f.r2 === r2 && f.c2 === c2) ||
            (f.labelR === r1 && f.labelC === c1)
        );
        if (existing) handleEditField(existing);
      }
    }

    if (!isSidebarOpen) setIsSidebarOpen(true);
    setActiveTab("mapping");
  };

  // --- MAIN SELECTION HANDLER ---
  const handleRangeSelect = useCallback((range: any) => {
    if (!range || range.length === 0) return;
    const lastRange = range[range.length - 1];
    if (!lastRange || lastRange.row == null || lastRange.column == null) return;

    const r1 = lastRange.row[0];
    const r2 = lastRange.row[1];
    const c1 = lastRange.column[0];
    const c2 = lastRange.column[1];

    processSelection(r1, c1, r2, c2, selectionModeRef.current);
  }, []);

  // --- BUTTON TOGGLE ---
  const toggleSelectionMode = (targetMode: "label" | "value") => {
    if (selectionMode === targetMode) {
      setSelectionMode("none");
      return;
    }

    const luckysheet = window.luckysheet;
    if (luckysheet) {
      const range = luckysheet.getRange();
      if (range && range.length > 0) {
        const last = range[range.length - 1];
        if (last && last.row && last.column) {
          processSelection(
            last.row[0],
            last.column[0],
            last.row[1],
            last.column[1],
            targetMode
          );
          return;
        }
      }
    }

    setSelectionMode(targetMode);
    toast.info(
      targetMode === "label"
        ? "Haz clic en la celda del Título"
        : "Haz clic o arrastra para los Datos"
    );
  };

  // --- ACTIONS ---
  const handleExpandSelection = () => {
    if (!draftValue || !window.luckysheet) return;
    const { r1, c1 } = draftValue;
    let r2 = r1;
    let limit = 0;
    while (limit < 5000) {
      const nextVal = window.luckysheet.getCellValue(r2 + 1, c1);
      if (nextVal === null || nextVal === "" || nextVal === undefined) break;
      r2++;
      limit++;
    }
    if (r2 > r1) {
      window.luckysheet.setRangeShow({ row: [r1, r2], column: [c1, c1] });
      const val = extractValueFromRange(r1, c1, r2, c1);
      setDraftValue({ r1, c1, r2, c2: c1, v: val });
      setFieldType("list");
      toast.success(`Expandido a ${r2 - r1 + 1} filas`);
    }
  };

  const handleSaveMapping = () => {
    if (!draftValue || !fieldKey) {
      toast.error("Faltan datos obligatorios");
      return;
    }
    const duplicate = mappedFields.find(
      (f) => f.key === fieldKey && f.id !== editingFieldId
    );
    if (duplicate) {
      toast.error(`La clave "${fieldKey}" ya existe`);
      return;
    }

    const newField: MappedField = {
      id: editingFieldId || crypto.randomUUID(),
      key: fieldKey,
      label: fieldName || "Sin Título",
      type: fieldType,
      sheetName: "Hoja1",
      r1: draftValue.r1,
      c1: draftValue.c1,
      r2: draftValue.r2,
      c2: draftValue.c2,
      previewValue: draftValue.v,
      labelR: draftLabel?.r,
      labelC: draftLabel?.c,
      labelPreview: draftLabel ? String(draftLabel.v) : undefined,
      // Derived field properties
      relatedTo: fieldType === "derived" ? fieldRelatedTo : undefined,
      operation: fieldType === "derived" ? fieldOperation : undefined,
    };

    setMappedFields((prev) => {
      const filtered = prev.filter((f) => f.id !== newField.id);
      return [...filtered, newField];
    });

    // Apply Colors
    try {
      const sheet = window.luckysheet;
      for (let r = newField.r1; r <= newField.r2; r++) {
        for (let c = newField.c1; c <= newField.c2; c++) {
          sheet.setCellFormat(r, c, "bg", "#dcfce7");
          sheet.setCellFormat(r, c, "fc", "#166534");
        }
      }
      if (newField.labelR !== undefined) {
        sheet.setCellFormat(newField.labelR, newField.labelC!, "bg", "#e0e7ff");
        sheet.setCellFormat(newField.labelR, newField.labelC!, "fc", "#3730a3");
      }
    } catch (e) {
      /* ignore */
    }

    toast.success("Campo guardado");
    resetEditor();
  };

  const resetEditor = () => {
    setEditingFieldId(null);
    setFieldName("");
    setFieldKey("");
    setFieldType("string");
    setFieldRelatedTo("");
    setFieldOperation("sum");
    setDraftLabel(null);
    setDraftValue(null);
    setSelectionMode("none");
  };

  const handleEditField = (field: MappedField) => {
    setEditingFieldId(field.id);
    setFieldName(field.label);
    setFieldKey(field.key);
    setFieldType(field.type);
    setFieldRelatedTo(field.relatedTo || "");
    setFieldOperation(field.operation || "sum");
    setDraftValue({
      r1: field.r1,
      c1: field.c1,
      r2: field.r2,
      c2: field.c2,
      v: field.previewValue,
    });
    if (field.labelR !== undefined && field.labelC !== undefined) {
      setDraftLabel({ r: field.labelR, c: field.labelC, v: field.labelPreview });
    } else {
      setDraftLabel(null);
    }
    window.luckysheet.setRangeShow({
      row: [field.r1, field.r2],
      column: [field.c1, field.c2],
    });
    setSelectionMode("none");
  };

  const removeMapping = (id: string, field: MappedField) => {
    setMappedFields((prev) => prev.filter((f) => f.id !== id));
    try {
      const sheet = window.luckysheet;
      for (let r = field.r1; r <= field.r2; r++) {
        for (let c = field.c1; c <= field.c2; c++) {
          sheet.setCellFormat(r, c, "bg", null);
          sheet.setCellFormat(r, c, "fc", null);
        }
      }
      if (field.labelR !== undefined) {
        sheet.setCellFormat(field.labelR, field.labelC!, "bg", null);
        sheet.setCellFormat(field.labelR, field.labelC!, "fc", null);
      }
    } catch (e) {
      /* ignore */
    }
    if (editingFieldId === id) resetEditor();
    toast.info("Campo eliminado");
  };

  // Handle direct association from field card
  const handleAssociate = (fieldId: string, relatedToKey: string | null) => {
    setMappedFields((prev) =>
      prev.map((f) =>
        f.id === fieldId
          ? { ...f, relatedTo: relatedToKey || undefined }
          : f
      )
    );
    if (relatedToKey) {
      toast.success(`Campo asociado con "${relatedToKey}"`);
    } else {
      toast.info("Asociación removida");
    }
  };

  // --- INIT ---
  useEffect(() => {
    if (!isOpen) return;

    const init = async () => {
      try {
        await initLuckysheetDeps();
        setIsReady(true);
      } catch (err) {
        console.error("Failed to load LuckySheet:", err);
        toast.error("Error al cargar la hoja de cálculo");
      }
    };
    init();
  }, [isOpen]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles[0] || !window.LuckyExcel) return;
      window.LuckyExcel.transformExcelToLucky(
        acceptedFiles[0],
        function (exportJson: any) {
          if (!exportJson.sheets || exportJson.sheets.length === 0) {
            toast.error("Error al leer archivo");
            return;
          }
          setExcelData(exportJson.sheets);
          setFileLoaded(true);
          toast.success("Archivo cargado");
        }
      );
    },
    [isReady]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    disabled: !isReady,
  });

  useEffect(() => {
    if (fileLoaded && isReady && excelData) {
      setTimeout(() => {
        if (window.luckysheet) {
          try {
            window.luckysheet.destroy();
          } catch (e) {
            /* ignore */
          }
          window.luckysheet.create({
            container: "luckysheet",
            data: excelData,
            showinfobar: false,
            lang: "es",
            allowEdit: false,
            forceCalculation: true,
            hook: { rangeSelect: handleRangeSelect },
          });
        }
      }, 100);
    }
  }, [fileLoaded, isReady, excelData, handleRangeSelect]);

  // --- RESIZE OBSERVER ---
  useEffect(() => {
    if (fileLoaded && isReady && window.luckysheet) {
      setTimeout(() => {
        window.luckysheet.resize();
      }, 300);
    }
  }, [isSidebarOpen, fileLoaded, isReady]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFieldName(val);
    if (!editingFieldId) setFieldKey(sanitizeKey(val));
  };

  /**
   * Generate output object based on selected JSON structure
   * - 'columns': Each field as separate array (raw structure) + _meta
   * - 'table': Smart pivot - list fields become rows, associated fields stay at root + _meta
   */
  const generateOutput = useCallback(() => {
    // Build meta information for associated fields
    const buildMeta = () => {
      const meta: Record<string, { esAgregadoDe: string; descripcion: string }> = {};
      mappedFields.forEach((f) => {
        if (f.relatedTo) {
          const relatedField = mappedFields.find((rf) => rf.key === f.relatedTo);
          meta[f.key] = {
            esAgregadoDe: f.relatedTo,
            descripcion: `"${f.label}" es un valor agregado de la columna "${relatedField?.label || f.relatedTo}"`
          };
        }
      });
      return Object.keys(meta).length > 0 ? meta : null;
    };

    // Column Structure: Each field is a separate key with its values
    if (jsonStructure === "columns") {
      const output: any = {};
      
      mappedFields.forEach((f) => {
        output[f.key] = f.previewValue;
      });
      
      // Include explicit meta if any associations exist
      const meta = buildMeta();
      if (meta) {
        output._meta = meta;
      }
      
      return output;
    }

    // Table Structure: Smart Pivot (preserves row-level relationships)
    const listFields = mappedFields.filter((f) => f.type === "list");
    const associatedFields = mappedFields.filter((f) => f.relatedTo && f.type !== "list");
    const otherFields = mappedFields.filter((f) => f.type !== "list" && !f.relatedTo);

    // Find max length among list fields
    const maxLength = Math.max(
      0,
      ...listFields.map((f) =>
        Array.isArray(f.previewValue) ? f.previewValue.length : 0
      )
    );

    // Build rows by pivoting list fields
    const rows: Record<string, unknown>[] = [];
    for (let i = 0; i < maxLength; i++) {
      const row: Record<string, unknown> = {};
      listFields.forEach((f) => {
        if (Array.isArray(f.previewValue) && f.previewValue[i] !== undefined) {
          row[f.key] = f.previewValue[i];
        }
      });
      rows.push(row);
    }

    // Build global data (root level)
    const globalData: Record<string, unknown> = {};

    // Add other fields (non-list, non-associated)
    otherFields.forEach((f) => {
      if (!Array.isArray(f.previewValue) || f.previewValue.length === 1) {
        globalData[f.key] = Array.isArray(f.previewValue) ? f.previewValue[0] : f.previewValue;
      } else {
        globalData[f.key] = f.previewValue;
      }
    });

    // Add associated/aggregate fields at root level
    associatedFields.forEach((f) => {
      globalData[f.key] = f.previewValue;
    });

    // Add explicit meta for associations
    const meta = buildMeta();
    if (meta) {
      globalData._meta = meta;
    }

    return { ...globalData, [mainListKey]: rows };
  }, [mappedFields, jsonStructure, mainListKey]);

  const copyToClipboard = () => {
    const json = JSON.stringify(generateOutput(), null, 2);
    navigator.clipboard.writeText(json);
    toast.success("Copiado al portapapeles");
  };

  const resetAll = () => {
    setFileLoaded(false);
    setExcelData(null);
    setMappedFields([]);
    resetEditor();
    toast.info("Reiniciado");
  };

  const handleImport = () => {
    if (mappedFields.length === 0) {
      toast.error("No hay campos configurados");
      return;
    }

    const output = generateOutput();

    // For table structure, the rows are in the mainListKey
    if (jsonStructure === "table" && Array.isArray(output[mainListKey])) {
      onSuccess(output[mainListKey] as Record<string, unknown>[]);
    } else {
      // For columns structure, wrap the output in an array
      onSuccess([output]);
    }

    onOpenChange(false);
    toast.success("Datos importados correctamente");
  };

  const handleClose = () => {
    if (window.luckysheet) {
      try {
        window.luckysheet.destroy();
      } catch (e) {
        /* ignore */
      }
    }
    setFileLoaded(false);
    setExcelData(null);
    setMappedFields([]);
    resetEditor();
    setIsReady(false);
    onOpenChange(false);
  };

  const typeLabel = type === "materials" ? "Materiales" : "Ruta Crítica";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        fullscreen
        showCloseButton={false}
      >
        <div className="flex flex-col h-full w-full bg-background text-foreground overflow-hidden">
          {/* HEADER */}
          <DialogHeader className="h-16 border-b flex flex-row items-center justify-between px-6 bg-card/80 backdrop-blur shrink-0 space-y-0">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg text-white shadow-sm">
                <FileSpreadsheet size={20} />
              </div>
              <div>
                <DialogTitle className="font-bold text-lg leading-tight">
                  Importar {typeLabel}
                </DialogTitle>
                <p className="text-xs text-muted-foreground font-medium">
                  Configuración Visual de Datos
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {fileLoaded && (
                <>
                  <Button
                    variant="ghost"
                    onClick={resetAll}
                    size="sm"
                    className="text-muted-foreground hover:text-destructive h-9"
                  >
                    <RefreshCw size={16} className="mr-2" /> Reiniciar
                  </Button>
                  <div className="h-6 w-px bg-border mx-1" />
                </>
              )}
              <Button
                size="sm"
                className="h-9 gap-2 shadow-sm font-semibold px-5"
                onClick={handleImport}
                disabled={mappedFields.length === 0}
              >
                <Save size={16} /> Importar ({mappedFields.length} campos)
              </Button>
              {fileLoaded && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className={cn(
                    "text-muted-foreground hover:text-foreground transition-transform ml-2",
                    !isSidebarOpen && "rotate-180"
                  )}
                >
                  <PanelRightClose size={20} />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X size={20} />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex flex-1 overflow-hidden relative">
            {/* MAIN AREA */}
            <div className="flex-1 bg-muted/10 relative flex flex-col transition-all duration-300">
              {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/90 z-50">
                  <Loader2 className="animate-spin text-primary" size={32} />
                  <span className="ml-3 text-muted-foreground">
                    Cargando LuckySheet...
                  </span>
                </div>
              )}
              {!fileLoaded ? (
                <div className="flex-1 flex items-center justify-center p-8">
                  <Card
                    {...getRootProps()}
                    className={cn(
                      "w-full max-w-xl py-12 flex flex-col items-center justify-center border-dashed border-2 cursor-pointer transition-all hover:shadow-xl group bg-card",
                      isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/20"
                    )}
                  >
                    <input {...getInputProps()} />
                    <div className="bg-primary/10 p-6 rounded-full mb-6 group-hover:bg-primary/20 transition-colors">
                      <Upload className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Sube tu Excel</h3>
                    <p className="text-muted-foreground text-center">
                      Arrastra el archivo aquí o haz clic para seleccionarlo
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Formatos: .xlsx, .xls, .csv
                    </p>
                  </Card>
                </div>
              ) : (
                <div className="flex-1 relative w-full h-full bg-white">
                  <div
                    id="luckysheet"
                    style={{
                      margin: 0,
                      padding: 0,
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      left: 0,
                      top: 0,
                    }}
                  />
                </div>
              )}
            </div>

            {/* SIDEBAR EDITOR */}
            <div
              className={cn(
                "border-l bg-card flex flex-col shadow-2xl z-20 shrink-0 transition-all duration-300 ease-in-out overflow-hidden",
                isSidebarOpen
                  ? "w-[420px] translate-x-0"
                  : "w-0 translate-x-full opacity-0"
              )}
            >
              <div className="p-4 pb-0 pt-5">
                <Tabs
                  value={activeTab}
                  onValueChange={(v) =>
                    setActiveTab(v as "mapping" | "preview")
                  }
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="mapping">
                      <MousePointerClick size={16} className="mr-2" /> Extractor
                    </TabsTrigger>
                    <TabsTrigger value="preview">
                      <Code size={16} className="mr-2" /> Datos
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {activeTab === "mapping" ? (
                  <>
                    {/* FIELD EDITOR CARD */}
                    <div
                      className={cn(
                        "rounded-xl border shadow-sm transition-all overflow-hidden",
                        editingFieldId
                          ? "ring-2 ring-primary/20 border-primary"
                          : "border-border"
                      )}
                    >
                      <div className="bg-muted/30 px-4 py-3 border-b flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          {editingFieldId ? (
                            <Pencil size={14} />
                          ) : (
                            <Wand2 size={14} />
                          )}
                          {editingFieldId ? "Editando Campo" : "Nuevo Campo"}
                        </span>
                        {editingFieldId && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-[10px] hover:text-destructive"
                            onClick={resetEditor}
                          >
                            Cancelar
                          </Button>
                        )}
                      </div>

                      <div className="p-4 space-y-5">
                        {/* SLOT 1: LABEL */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-bold uppercase text-muted-foreground">
                              Nombre del Campo
                            </Label>
                            {draftLabel && (
                              <Badge
                                variant="outline"
                                className="text-[10px] bg-indigo-50 text-indigo-700 border-indigo-200"
                              >
                                {getColLetter(draftLabel.c)}
                                {draftLabel.r + 1}
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1 relative">
                              <Input
                                value={fieldName}
                                onChange={handleNameChange}
                                className="h-10 text-sm pl-9"
                                placeholder="Ej. Total Factura"
                              />
                              <Tag
                                size={14}
                                className="absolute left-3 top-3 text-muted-foreground"
                              />
                            </div>
                            <Button
                              variant={
                                selectionMode === "label"
                                  ? "default"
                                  : "outline"
                              }
                              size="icon"
                              className={cn(
                                "h-10 w-10 shrink-0",
                                selectionMode === "label" &&
                                  "animate-pulse bg-indigo-600 hover:bg-indigo-700"
                              )}
                              onClick={() => toggleSelectionMode("label")}
                              title="Capturar Título"
                            >
                              <Target size={16} />
                            </Button>
                          </div>
                        </div>

                        {/* SLOT 2: VALUE */}
                        <div className="space-y-2 pt-2 border-t border-dashed">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-bold uppercase text-muted-foreground">
                              Rango de Datos
                            </Label>
                            {draftValue && (
                              <Badge
                                variant="outline"
                                className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200"
                              >
                                {getAddress(
                                  draftValue.r1,
                                  draftValue.c1,
                                  draftValue.r2,
                                  draftValue.c2
                                )}
                              </Badge>
                            )}
                          </div>

                          {draftValue ? (
                            <div className="bg-muted/30 border rounded-md p-3 space-y-2">
                              <div className="flex items-center gap-2 text-sm font-medium text-foreground truncate">
                                <Database size={14} className="text-emerald-600" />
                                {Array.isArray(draftValue.v)
                                  ? `Lista de ${draftValue.v.length} valores`
                                  : String(draftValue.v)}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs flex-1"
                                  onClick={() => toggleSelectionMode("value")}
                                >
                                  Cambiar Selección
                                </Button>
                                {draftValue.r1 === draftValue.r2 &&
                                  draftValue.c1 === draftValue.c2 && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-7 w-7 p-0 text-emerald-600"
                                      onClick={handleExpandSelection}
                                      title="Expandir lista"
                                    >
                                      <ChevronsDown size={14} />
                                    </Button>
                                  )}
                              </div>
                            </div>
                          ) : (
                            <Button
                              variant={
                                selectionMode === "value"
                                  ? "default"
                                  : "outline"
                              }
                              className={cn(
                                "w-full justify-start text-muted-foreground border-dashed",
                                selectionMode === "value" &&
                                  "text-white border-solid animate-pulse bg-emerald-600 hover:bg-emerald-700"
                              )}
                              onClick={() => toggleSelectionMode("value")}
                            >
                              <MousePointerClick size={16} className="mr-2" />
                              {selectionMode === "value"
                                ? "Seleccionando datos..."
                                : "Seleccionar Datos"}
                            </Button>
                          )}
                        </div>

                        {/* SETTINGS */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-muted-foreground">
                              Tipo de Dato
                            </Label>
                            <Select
                              value={fieldType}
                              onValueChange={(v) => setFieldType(v as DataType)}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="string">Texto</SelectItem>
                                <SelectItem value="number">Número</SelectItem>
                                <SelectItem value="date">Fecha</SelectItem>
                                <SelectItem value="boolean">Si/No</SelectItem>
                                <SelectItem value="list">Lista</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-muted-foreground flex items-center justify-between">
                              ID Variable
                              <button
                                onClick={() => setShowAdvanced(!showAdvanced)}
                              >
                                <Settings2 size={10} />
                              </button>
                            </Label>
                            <Input
                              value={fieldKey}
                              onChange={(e) =>
                                setFieldKey(sanitizeKey(e.target.value))
                              }
                              className={cn(
                                "h-9 text-xs font-mono",
                                !showAdvanced &&
                                  "opacity-50 pointer-events-none bg-muted"
                              )}
                            />
                          </div>
                        </div>

                        <Button
                          className="w-full font-bold shadow-md mt-2"
                          onClick={handleSaveMapping}
                          disabled={!draftValue || !fieldName}
                        >
                          {editingFieldId
                            ? "Actualizar Campo"
                            : "Guardar Campo"}
                        </Button>
                      </div>
                    </div>

                    {/* MAPPED FIELDS LIST */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
                        Campos ({mappedFields.length})
                      </h3>
                      <div className="space-y-2 pb-10">
                        {mappedFields.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground text-xs italic border-2 border-dashed rounded-lg bg-muted/10">
                            Sin campos configurados.
                          </div>
                        )}
                        {mappedFields.map((field) => {
                          const listFields = mappedFields.filter(
                            (f) => f.type === "list" && f.id !== field.id
                          );
                          const showAssociation = field.type !== "list" && listFields.length > 0;
                          
                          return (
                            <div
                              key={field.id}
                              className={cn(
                                "group p-3 rounded-lg border bg-card hover:border-primary/40 hover:shadow-md transition-all relative overflow-hidden",
                                editingFieldId === field.id &&
                                  "ring-2 ring-primary/20 border-primary"
                              )}
                            >
                              <div
                                className={cn(
                                  "w-1 h-full absolute left-0 top-0 transition-colors",
                                  editingFieldId === field.id
                                    ? "bg-primary"
                                    : "bg-muted group-hover:bg-primary/50"
                                )}
                              />
                              
                              {/* Main field info - clickable */}
                              <div 
                                className="flex items-center gap-3 cursor-pointer pl-2"
                                onClick={() => handleEditField(field)}
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-semibold truncate text-foreground">
                                      {field.label}
                                    </span>
                                    <Badge
                                      variant="secondary"
                                      className="text-[10px] h-5 px-1.5"
                                    >
                                      {field.key}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    {field.labelR !== undefined && (
                                      <span className="text-indigo-600 font-bold px-1.5 py-0.5 bg-indigo-50 rounded border border-indigo-100">
                                        T
                                      </span>
                                    )}
                                    <span className="font-mono bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100">
                                      {getAddress(field.r1, field.c1, field.r2, field.c2)}
                                    </span>
                                    {field.type === "list" && (
                                      <span className="text-amber-600 font-bold px-1.5 py-0.5 bg-amber-50 rounded border border-amber-100">
                                        Lista
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeMapping(field.id, field);
                                  }}
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                              
                              {/* Association dropdown - only for non-list fields */}
                              {showAssociation && (
                                <div className="mt-2 pt-2 border-t border-dashed pl-2" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex items-center gap-2">
                                    <Link size={12} className="text-amber-500 shrink-0" />
                                    <Select
                                      value={field.relatedTo || "none"}
                                      onValueChange={(v) => handleAssociate(field.id, v === "none" ? null : v)}
                                    >
                                      <SelectTrigger className="h-7 text-xs flex-1">
                                        <SelectValue placeholder="Asociar con..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="none">Sin asociación</SelectItem>
                                        {listFields.map((lf) => (
                                          <SelectItem key={lf.key} value={lf.key}>
                                            🔗 {lf.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}
                              
                              {/* Show current association badge */}
                              {field.relatedTo && (
                                <div className="mt-1 pl-2">
                                  <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                    Asociado con: {field.relatedTo}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col animate-in fade-in duration-300">
                    {/* Structure Toggle */}
                    <div className="flex justify-center mb-4 bg-muted/30 p-1 rounded-lg border">
                      <button
                        onClick={() => setJsonStructure("table")}
                        className={cn(
                          "flex-1 text-xs py-1.5 px-3 rounded-md transition-all flex items-center justify-center gap-2 font-medium",
                          jsonStructure === "table"
                            ? "bg-background shadow text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <TableIcon size={14} /> Tabla Inteligente
                      </button>
                      <button
                        onClick={() => setJsonStructure("columns")}
                        className={cn(
                          "flex-1 text-xs py-1.5 px-3 rounded-md transition-all flex items-center justify-center gap-2 font-medium",
                          jsonStructure === "columns"
                            ? "bg-background shadow text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Columns size={14} /> Columnas Simples
                      </button>
                    </div>

                    {/* List Key Configuration (only for table mode) */}
                    {jsonStructure === "table" && (
                      <div className="mb-4 space-y-2 border-b pb-4">
                        <Label className="text-xs font-bold uppercase text-muted-foreground">
                          Nombre de la lista
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            value={mainListKey}
                            onChange={(e) => setMainListKey(e.target.value || "items")}
                            className="h-8 text-xs font-mono"
                            placeholder="items"
                          />
                          <div className="flex items-center text-[10px] text-muted-foreground bg-muted px-2 rounded whitespace-nowrap">
                            Ej: "conceptos"
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Los campos de tipo "Lista" se convertirán en filas dentro de esta propiedad.
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between items-center mb-2 px-1">
                      <h3 className="font-bold text-sm">Resultado JSON</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-2"
                        onClick={copyToClipboard}
                      >
                        <Copy size={12} /> Copiar
                      </Button>
                    </div>

                    <div className="bg-[#1e1e1e] text-[#d4d4d4] p-4 rounded-xl font-mono text-xs overflow-auto flex-1 shadow-inner border border-neutral-800 leading-relaxed">
                      <pre>{JSON.stringify(generateOutput(), null, 2)}</pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
