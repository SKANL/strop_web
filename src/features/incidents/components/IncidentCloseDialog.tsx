/**
 * Dialog para cerrar una incidencia con nota obligatoria
 * Incluye advertencia de inmutabilidad
 */

import { useState } from "react";
import { motion } from "motion/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import type { IncidentWithDetails } from "@/lib/mock/types";

interface IncidentCloseDialogProps {
  incident: IncidentWithDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: (notes: string) => void;
}

const dialogVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      duration: 0.4,
      bounce: 0.15,
    },
  },
};

const warningPulse = {
  scale: [1, 1.02, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

const errorShake = {
  x: [0, -8, 8, -8, 8, 0],
  transition: { duration: 0.4 },
};

export function IncidentCloseDialog({
  incident,
  open,
  onOpenChange,
  onClose,
}: IncidentCloseDialogProps) {
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [showError, setShowError] = useState(false);

  // Unused but kept for potential future use
  void incident;

  const isValid = notes.trim().length >= 10 && confirmed;

  const handleClose = () => {
    if (!isValid) {
      setShowError(true);
      setTimeout(() => setShowError(false), 500);
      return;
    }
    onClose(notes);
    setNotes("");
    setConfirmed(false);
  };

  const handleCancel = () => {
    setNotes("");
    setConfirmed(false);
    setShowError(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent asChild>
        <motion.div
          variants={dialogVariants}
          initial="hidden"
          animate="visible"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-success" />
              Cerrar Incidencia
            </AlertDialogTitle>
            <AlertDialogDescription>
              Al cerrar esta incidencia, el registro quedará inalterable como parte de la bitácora digital oficial.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            {/* Warning Banner */}
            <motion.div
              animate={warningPulse}
              className="flex items-start gap-3 p-3 bg-warning/10 border border-warning/30 rounded-lg"
            >
              <AlertTriangle className="size-5 text-warning shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-warning">
                  Acción irreversible
                </p>
                <p className="text-warning/80 text-xs mt-1">
                  Una vez cerrada, no podrás editar esta incidencia. Solo se podrán agregar comentarios de seguimiento.
                </p>
              </div>
            </motion.div>

            {/* Closure Notes */}
            <motion.div 
              className="space-y-2"
              animate={showError && notes.trim().length < 10 ? errorShake : {}}
            >
              <Label htmlFor="close-notes">
                Nota de cierre <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="close-notes"
                placeholder="Describe cómo se resolvió la incidencia..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className={notes.trim().length > 0 && notes.trim().length < 10 
                  ? "border-destructive focus-visible:ring-destructive/20" 
                  : ""
                }
              />
              <p className="text-xs text-muted-foreground">
                {notes.trim().length}/10 caracteres mínimos
                {notes.trim().length > 0 && notes.trim().length < 10 && (
                  <span className="text-destructive ml-2">
                    (faltan {10 - notes.trim().length})
                  </span>
                )}
              </p>
            </motion.div>

            {/* Confirmation Checkbox */}
            <motion.div 
              className="flex items-start gap-3"
              animate={showError && !confirmed ? errorShake : {}}
            >
              <Checkbox
                id="confirm-close"
                checked={confirmed}
                onCheckedChange={(checked) => setConfirmed(checked === true)}
              />
              <Label
                htmlFor="confirm-close"
                className="text-sm leading-relaxed cursor-pointer"
              >
                Entiendo que esta acción es irreversible y que el registro formará parte de la bitácora digital inalterable del proyecto.
              </Label>
            </motion.div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClose}
              disabled={!isValid}
              className="bg-success hover:bg-success/90"
            >
              Cerrar Incidencia
            </AlertDialogAction>
          </AlertDialogFooter>
        </motion.div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
