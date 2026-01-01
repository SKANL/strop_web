/**
 * Official Composer panel for generating legal drafts
 * Collapsible right panel with selected events
 */

"use client";

import { motion, AnimatePresence } from "motion/react";
import { useStore } from "@nanostores/react";
import { Sparkles, FileDown, Lock, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  $selectedLogIds,
  $selectedCount,
  $isComposerOpen,
  clearSelection,
  toggleComposer,
} from "../stores/bitacoraStore";
import { getOperationalLogById } from "@/lib/mock/operational-logs";
import { categoryLabels, categoryColors } from "../types";

export function OfficialComposer() {
  const selectedIds = useStore($selectedLogIds);
  const selectedCount = useStore($selectedCount);
  const isOpen = useStore($isComposerOpen);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [pin, setPin] = useState("");

  const selectedLogs = selectedIds.map(getOperationalLogById).filter(Boolean);

  const generateDraftText = () => {
    if (selectedLogs.length === 0) return "";

    const today = new Date().toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let draft = `NOTA DE BITÁCORA\nFecha: ${today}\n\n`;

    selectedLogs.forEach((log, index) => {
      if (!log) return;
      const time = new Date(log.userDate).toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
      });
      draft += `${index + 1}. [${time}] ${log.content.title}\n`;
      draft += `   ${log.content.description}\n`;
      draft += `   Categoría: ${categoryLabels[log.category]}\n`;
      draft += `   Reportado por: ${log.author.name} (${log.author.role})\n`;
      if (log.evidence.photos.length > 0) {
        draft += `   Evidencia fotográfica: ${log.evidence.photos.length} imagen(es)\n`;
      }
      draft += `\n`;
    });

    draft += `---\nGenerado automáticamente por Strop SaaS\n`;
    draft += `Integridad verificada: Cadena de bloques íntegra\n`;

    return draft;
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={toggleComposer}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-10"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <>
      <div className="h-full flex flex-col border-l bg-background">
        {/* Header */}
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Borrador Oficial</h3>
              <p className="text-xs text-muted-foreground">
                {selectedCount} eventos seleccionados
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleComposer}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Selected items */}
        <ScrollArea className="flex-1 p-4">
          <AnimatePresence mode="popLayout">
            {selectedLogs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-muted-foreground py-8"
              >
                <p className="text-sm">Selecciona eventos del timeline</p>
                <p className="text-xs mt-1">para incluirlos en la nota oficial</p>
              </motion.div>
            ) : (
              <div className="space-y-2">
                {selectedLogs.map((log) => {
                  if (!log) return null;
                  return (
                    <motion.div
                      key={log.id}
                      layoutId={`composer-${log.id}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <Card className="p-3">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={cn("text-xs", categoryColors[log.category])}
                          >
                            {categoryLabels[log.category]}
                          </Badge>
                          <span className="text-sm font-medium flex-1 truncate">
                            {log.content.title}
                          </span>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>

        {/* Actions */}
        <div className="p-4 border-t space-y-2">
          <Button
            className="w-full gap-2"
            disabled={selectedCount === 0}
            onClick={() => setShowDraftDialog(true)}
          >
            <Sparkles className="h-4 w-4" />
            Generar Redacción Legal
          </Button>
          <Button variant="outline" className="w-full gap-2" disabled={selectedCount === 0}>
            <FileDown className="h-4 w-4" />
            Exportar PDF
          </Button>
          <Button
            variant="destructive"
            className="w-full gap-2"
            onClick={() => setShowCloseDialog(true)}
          >
            <Lock className="h-4 w-4" />
            Cerrar Día
          </Button>
        </div>
      </div>

      {/* Draft Dialog */}
      <Dialog open={showDraftDialog} onOpenChange={setShowDraftDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Borrador de Nota Oficial</DialogTitle>
            <DialogDescription>
              Texto generado para copiar a la Bitácora Oficial (BESOP)
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={generateDraftText()}
            readOnly
            className="h-[400px] font-mono text-sm"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDraftDialog(false)}>
              Cerrar
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(generateDraftText());
              }}
            >
              Copiar al Portapapeles
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Day Dialog */}
      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cerrar Día</DialogTitle>
            <DialogDescription>
              Esta acción bloqueará todos los eventos del día. Ingresa tu PIN para confirmar.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <InputOTP maxLength={4} value={pin} onChange={setPin}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCloseDialog(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={pin.length !== 4}
              onClick={() => {
                // Mock close action
                console.log("Closing day with PIN:", pin);
                setShowCloseDialog(false);
                setPin("");
                clearSelection();
              }}
            >
              Confirmar Cierre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
