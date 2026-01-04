"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, FileSpreadsheet, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  accept?: string; // ".xlsx,.csv"
  maxSizeMB?: number;
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string | null;
  className?: string;
}

export function FileUpload({
  accept = ".xlsx,.csv",
  maxSizeMB = 10,
  onFileSelect,
  onFileRemove,
  isUploading = false,
  uploadProgress = 0,
  error = null,
  className,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSelectFile(file);
    }
  };

  const validateAndSelectFile = (file: File) => {
    // Validar extensión
    const ext = file.name.split('.').pop()?.toLowerCase();
    const allowedExts = accept.split(',').map(e => e.trim().replace('.', ''));
    
    if (!allowedExts.includes(ext || '')) {
      // Normalmente aquí se llamaría a un callback de error externo o se usa estado interno
      // Por simplicidad, asumimos que el padre maneja errores complejos o lo mostramos localmente
      console.error("Extension not allowed");
      return;
    }

    // Validar tamaño
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      console.error("File to large");
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSelectFile(file);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onFileRemove?.();
  };

  return (
    <div className={cn("space-y-4", className)}>
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            key="dropzone"
          >
            <Card
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed transition-all cursor-pointer hover:bg-muted/50 flex flex-col items-center justify-center py-10 px-6 text-center gap-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none",
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
              )}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  inputRef.current?.click();
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Subir archivo"
            >
              <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
                id="file-upload-input"
              />
              <div className="p-4 rounded-full bg-muted">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  <span className="text-primary hover:underline">Haz clic para subir</span> o arrastra y suelta
                </p>
                <p className="text-xs text-muted-foreground">
                  Formatos soportados: {accept} (Máx. {maxSizeMB}MB)
                </p>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            key="selected-file"
            className="relative"
          >
            <Card className="p-4 flex items-center justify-between border-primary/20 bg-primary/5">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="p-2 bg-background rounded-md border shadow-sm shrink-0">
                  <FileSpreadsheet className="h-6 w-6 text-success" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate max-w-[200px] sm:max-w-md">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              
              {!isUploading && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
                  onClick={handleRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </Card>

            {isUploading && (
              <motion.div 
                initial={{ opacity: 0, marginTop: 0 }}
                animate={{ opacity: 1, marginTop: 12 }}
                className="space-y-2"
              >
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Procesando archivo...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}
    </div>
  );
}
