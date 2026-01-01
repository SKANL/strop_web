/**
 * Excel Import Flow Component
 * Multi-step wizard for importing Excel/CSV files
 * Steps: 1) Upload → 2) Map Columns → 3) Review → 4) Import
 */

import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  FileSpreadsheet,
  ArrowLeft,
  ArrowRight,
  Check,
  AlertCircle,
  Loader2,
  Download,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { ColumnMapper } from "./ColumnMapper";
import { parseExcelFile, type ParsedExcelData } from "@/lib/utils/excel";
import {
  suggestMapping,
  validateMapping,
  transformDataWithMapping,
  criticalPathFields,
  materialsFields,
  type TargetField,
  type MappingSuggestion,
} from "@/lib/utils/fuzzyMatch";

type ImportStep = "upload" | "mapping" | "review" | "importing" | "complete";
type ImportType = "critical_path" | "materials";

interface ExcelImportFlowProps {
  type: ImportType;
  projectId: string;
  onSuccess: (data: Record<string, unknown>[]) => void;
  onCancel: () => void;
}

export function ExcelImportFlow({
  type,
  projectId,
  onSuccess,
  onCancel,
}: ExcelImportFlowProps) {
  // Step state
  const [currentStep, setCurrentStep] = useState<ImportStep>("upload");

  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedExcelData | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  // Mapping state
  const [suggestions, setSuggestions] = useState<MappingSuggestion[]>([]);
  const [finalMapping, setFinalMapping] = useState<Map<string, string> | null>(
    null
  );

  // Import state
  const [importProgress, setImportProgress] = useState(0);
  const [importedCount, setImportedCount] = useState(0);

  // Get target fields based on import type
  const targetFields: TargetField[] =
    type === "critical_path" ? criticalPathFields : materialsFields;

  const typeLabel = type === "critical_path" ? "Ruta Crítica" : "Materiales";

  // Handle file selection
  const handleFileSelect = useCallback(
    async (file: File) => {
      setSelectedFile(file);
      setParseError(null);

      try {
        const data = await parseExcelFile(file);
        setParsedData(data);

        // Generate initial mapping suggestions
        const mappingSuggestions = suggestMapping(data.headers, targetFields);
        setSuggestions(mappingSuggestions);

        // Move to mapping step
        setCurrentStep("mapping");

        toast.success("Archivo procesado", {
          description: `${data.totalRows} filas detectadas en "${data.sheetName}"`,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error al procesar el archivo";
        setParseError(message);
        toast.error("Error al procesar archivo", { description: message });
      }
    },
    [targetFields]
  );

  // Handle mapping change
  const handleMappingChange = useCallback(
    (sourceColumn: string, targetKey: string | null) => {
      setSuggestions((prev) =>
        prev.map((s) =>
          s.sourceColumn === sourceColumn
            ? {
                ...s,
                targetField:
                  targetFields.find((f) => f.key === targetKey) ?? null,
              }
            : s
        )
      );
    },
    [targetFields]
  );

  // Handle mapping confirmation
  const handleMappingConfirm = useCallback(
    async (mapping: Map<string, string>) => {
      setFinalMapping(mapping);
      setCurrentStep("review");
    },
    []
  );

  // Handle import execution
  const handleImport = useCallback(async () => {
    if (!parsedData || !finalMapping) return;

    setCurrentStep("importing");
    setImportProgress(0);

    try {
      // Transform data using the confirmed mapping
      const transformedData = transformDataWithMapping(
        parsedData.rows,
        finalMapping
      );

      // Simulate import progress (in real implementation, this would batch insert to Supabase)
      const totalRows = transformedData.length;
      const batchSize = 10;
      const batches = Math.ceil(totalRows / batchSize);

      for (let i = 0; i < batches; i++) {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 100));

        const progress = Math.round(((i + 1) / batches) * 100);
        setImportProgress(progress);
        setImportedCount(Math.min((i + 1) * batchSize, totalRows));
      }

      setCurrentStep("complete");
      toast.success("Importación exitosa", {
        description: `Se importaron ${totalRows} registros de ${typeLabel}`,
      });

      // Call success callback with transformed data
      onSuccess(transformedData);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error durante la importación";
      toast.error("Error de importación", { description: message });
      setCurrentStep("review"); // Go back to review
    }
  }, [parsedData, finalMapping, typeLabel, onSuccess]);

  // Render step indicator
  const steps = [
    { key: "upload", label: "Subir Archivo" },
    { key: "mapping", label: "Mapear Columnas" },
    { key: "review", label: "Revisar" },
    { key: "complete", label: "Completado" },
  ];

  const currentStepIndex = steps.findIndex(
    (s) => s.key === (currentStep === "importing" ? "review" : currentStep)
  );

  return (
    <div className="flex flex-col h-full">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div
              className={`
                flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors
                ${
                  index <= currentStepIndex
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }
              `}
            >
              {index < currentStepIndex ? (
                <Check className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>
            <span
              className={`
                ml-2 text-sm hidden sm:inline
                ${
                  index <= currentStepIndex
                    ? "text-foreground"
                    : "text-muted-foreground"
                }
              `}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`
                  w-8 h-0.5 mx-2
                  ${index < currentStepIndex ? "bg-primary" : "bg-muted"}
                `}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* Step 1: Upload */}
        {currentStep === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Importar {typeLabel}
              </h3>
              <p className="text-sm text-muted-foreground">
                Sube un archivo Excel (.xlsx) o CSV con los datos a importar
              </p>
            </div>

            <FileUpload
              accept=".xlsx,.csv"
              onFileSelect={handleFileSelect}
              error={parseError}
            />

            {/* Download Template Link */}
            <div className="mt-6 text-center">
              <Button variant="link" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Descargar plantilla de ejemplo
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Mapping */}
        {currentStep === "mapping" && parsedData && (
          <motion.div
            key="mapping"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col min-h-0"
          >
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold mb-1">
                Mapear Columnas
              </h3>
              <p className="text-sm text-muted-foreground">
                Asocia las columnas de tu archivo con los campos del sistema
              </p>
            </div>

            <div className="flex-1 min-h-0">
              <ColumnMapper
                suggestions={suggestions}
                targetFields={targetFields}
                previewData={parsedData.previewRows}
                onMappingChange={handleMappingChange}
                onConfirm={handleMappingConfirm}
                onCancel={() => setCurrentStep("upload")}
              />
            </div>
          </motion.div>
        )}

        {/* Step 3: Review */}
        {currentStep === "review" && parsedData && finalMapping && (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Revisar Importación
              </h3>
              <p className="text-sm text-muted-foreground">
                Confirma los detalles antes de importar
              </p>
            </div>

            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
                  Resumen de Importación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Archivo:</span>
                  <span className="font-medium">{selectedFile?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hoja:</span>
                  <span className="font-medium">{parsedData.sheetName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total de filas:</span>
                  <span className="font-medium">{parsedData.totalRows}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Columnas mapeadas:
                  </span>
                  <span className="font-medium">{finalMapping.size}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tipo:</span>
                  <Badge variant="secondary">{typeLabel}</Badge>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("mapping")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al Mapeo
              </Button>
              <Button onClick={handleImport} className="gap-2">
                Importar Datos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3b: Importing */}
        {currentStep === "importing" && (
          <motion.div
            key="importing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center py-12"
          >
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <h3 className="text-lg font-semibold mb-2">Importando datos...</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {importedCount} de {parsedData?.totalRows ?? 0} registros
            </p>
            <div className="w-full max-w-xs">
              <Progress value={importProgress} className="h-2" />
            </div>
          </motion.div>
        )}

        {/* Step 4: Complete */}
        {currentStep === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center py-12"
          >
            <div className="p-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
              <Check className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              ¡Importación Exitosa!
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Se importaron {parsedData?.totalRows ?? 0} registros de{" "}
              {typeLabel}
            </p>
            <Button onClick={onCancel}>Cerrar</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
