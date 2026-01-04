/**
 * Column Mapper Component
 * Allows users to manually adjust column-to-field mappings
 * with smart suggestions from fuzzy matching
 */

import { useState, useMemo, useCallback } from "react";
import {
  ArrowRight,
  Check,
  AlertCircle,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import type { MappingSuggestion, TargetField } from "@/lib/utils/fuzzyMatch";
import { validateMapping } from "@/lib/utils/fuzzyMatch";

interface ColumnMapperProps {
  suggestions: MappingSuggestion[];
  targetFields: TargetField[];
  previewData: Record<string, unknown>[];
  onMappingChange: (sourceColumn: string, targetKey: string | null) => void;
  onConfirm: (mapping: Map<string, string>) => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

// Format cell value for preview
function formatPreviewValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  const str = String(value);
  return str.length > 30 ? str.substring(0, 27) + "..." : str;
}

// Get confidence color based on match quality
function getConfidenceColor(confidence: number): string {
  if (confidence >= 80) return "text-success";
  if (confidence >= 50) return "text-warning";
  return "text-muted-foreground";
}

export function ColumnMapper({
  suggestions,
  targetFields,
  previewData,
  onMappingChange,
  onConfirm,
  onCancel,
  isProcessing = false,
}: ColumnMapperProps) {
  // Track current mapping state
  const [currentMapping, setCurrentMapping] = useState<
    Map<string, string | null>
  >(() => {
    const map = new Map<string, string | null>();
    suggestions.forEach((s) => {
      map.set(s.sourceColumn, s.targetField?.key ?? null);
    });
    return map;
  });

  // Calculate which target fields are already used
  const usedTargetKeys = useMemo(() => {
    const used = new Set<string>();
    currentMapping.forEach((targetKey) => {
      if (targetKey) used.add(targetKey);
    });
    return used;
  }, [currentMapping]);

  // Validate mapping
  const validation = useMemo(() => {
    const mappingSuggestions: MappingSuggestion[] = suggestions.map((s) => ({
      ...s,
      targetField:
        targetFields.find((f) => f.key === currentMapping.get(s.sourceColumn)) ??
        null,
    }));
    return validateMapping(mappingSuggestions, targetFields);
  }, [currentMapping, suggestions, targetFields]);

  // Handle field selection change
  const handleFieldChange = useCallback(
    (sourceColumn: string, targetKey: string) => {
      const newKey = targetKey === "none" ? null : targetKey;
      setCurrentMapping((prev) => {
        const newMap = new Map(prev);
        newMap.set(sourceColumn, newKey);
        return newMap;
      });
      onMappingChange(sourceColumn, newKey);
    },
    [onMappingChange]
  );

  // Handle confirm
  const handleConfirm = useCallback(() => {
    const finalMapping = new Map<string, string>();
    currentMapping.forEach((targetKey, sourceColumn) => {
      if (targetKey) {
        finalMapping.set(sourceColumn, targetKey);
      }
    });
    onConfirm(finalMapping);
  }, [currentMapping, onConfirm]);

  // Count stats
  const mappedCount = Array.from(currentMapping.values()).filter(Boolean).length;
  const requiredCount = targetFields.filter((f) => f.required).length;
  const autoMatchedCount = suggestions.filter((s) => s.isAutoMatched).length;

  return (
    <div className="flex flex-col h-full">
      {/* Header Stats */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Badge variant="secondary" className="gap-1.5 px-2.5 py-1">
          <Sparkles className="h-3 w-3 text-warning" />
          {autoMatchedCount} auto-detectados
        </Badge>
        <Badge
          variant={validation.isValid ? "default" : "secondary"}
          className={cn(
            "gap-1.5 px-2.5 py-1",
            validation.isValid
              ? "bg-success/20 text-success"
              : ""
          )}
        >
          {validation.isValid ? (
            <Check className="h-3 w-3" />
          ) : (
            <AlertCircle className="h-3 w-3" />
          )}
          {mappedCount}/{requiredCount} requeridos
        </Badge>
      </div>

      {/* Validation Alert */}
      <AnimatePresence>
        {!validation.isValid && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Campos requeridos sin mapear:</strong>{" "}
                {validation.missingFields.map((f) => f.label).join(", ")}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mapping Table */}
      <ScrollArea className="flex-1 border rounded-lg">
        <Table>
          <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur-sm z-10">
            <TableRow>
              <TableHead className="w-[200px]">Columna Excel</TableHead>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="w-[200px]">Campo Strop</TableHead>
              <TableHead className="w-[100px]">Confianza</TableHead>
              <TableHead>Vista previa</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suggestions.map((suggestion) => {
              const currentTargetKey = currentMapping.get(
                suggestion.sourceColumn
              );
              const currentField = targetFields.find(
                (f) => f.key === currentTargetKey
              );

              return (
                <TableRow
                  key={suggestion.sourceColumn}
                  className={cn(
                    "transition-colors",
                    currentTargetKey && "bg-success/5"
                  )}
                >
                  {/* Source Column */}
                  <TableCell className="font-medium">
                    <code className="text-sm bg-muted px-1.5 py-0.5 rounded">
                      {suggestion.sourceColumn}
                    </code>
                  </TableCell>

                  {/* Arrow */}
                  <TableCell>
                    <ArrowRight
                      className={cn(
                        "h-4 w-4",
                        currentTargetKey
                          ? "text-success"
                          : "text-muted-foreground/50"
                      )}
                    />
                  </TableCell>

                  {/* Target Field Select */}
                  <TableCell>
                    <Select
                      value={currentTargetKey ?? "none"}
                      onValueChange={(value) =>
                        handleFieldChange(suggestion.sourceColumn, value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar campo..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">
                          <span className="text-muted-foreground">
                            — No mapear —
                          </span>
                        </SelectItem>
                        {targetFields.map((field) => {
                          const isUsed =
                            usedTargetKeys.has(field.key) &&
                            field.key !== currentTargetKey;
                          return (
                            <SelectItem
                              key={field.key}
                              value={field.key}
                              disabled={isUsed}
                            >
                              <span className="flex items-center gap-2">
                                {field.label}
                                {field.required && (
                                  <span className="text-destructive text-xs">*</span>
                                )}
                                {isUsed && (
                                  <span className="text-xs text-muted-foreground">
                                    (en uso)
                                  </span>
                                )}
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* Confidence */}
                  <TableCell>
                    {suggestion.confidence > 0 && (
                      <Tooltip>
                        <TooltipTrigger>
                          <span
                            className={cn(
                              "text-sm font-medium",
                              getConfidenceColor(suggestion.confidence)
                            )}
                          >
                            {suggestion.confidence}%
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          {suggestion.confidence >= 80
                            ? "Alta coincidencia"
                            : suggestion.confidence >= 50
                            ? "Coincidencia parcial"
                            : "Baja coincidencia"}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </TableCell>

                  {/* Preview */}
                  <TableCell className="text-muted-foreground text-sm">
                    {previewData.length > 0 && (
                      <span className="truncate max-w-[200px] inline-block">
                        {formatPreviewValue(
                          previewData[0][suggestion.sourceColumn]
                        )}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Actions */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          {previewData.length > 0 && (
            <>
              Mostrando vista previa de la primera fila de{" "}
              <strong>{previewData.length}</strong> en total
            </>
          )}
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!validation.isValid || isProcessing}
            className="gap-2"
          >
            {isProcessing ? (
              <>
                <span className="animate-spin">⏳</span>
                Procesando...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Confirmar Mapeo
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
