"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { 
  Package, 
  ArrowRightLeft, 
  AlertTriangle, 
  CheckCircle2,
  FileSpreadsheet,
  Search
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FileUpload } from "@/components/ui/file-upload";

import type { MaterialWithStats } from "@/lib/mock/types";

interface ProjectMaterialsTabProps {
  materials: MaterialWithStats[];
}

export function ProjectMaterialsTab({ materials }: ProjectMaterialsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const filteredMaterials = useMemo(() => {
    return materials.filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [materials, searchTerm]);

  const stats = useMemo(() => {
    const total = materials.length;
    const withDeviation = materials.filter(m => m.hasDeviation).length;
    const totalPlanned = materials.reduce((acc, m) => acc + m.plannedQuantity, 0);
    const totalRequested = materials.reduce((acc, m) => acc + m.requestedQuantity, 0);

    return { total, withDeviation, totalPlanned, totalRequested };
  }, [materials]);

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simular carga
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simular fin de proceso
    setTimeout(() => {
      clearInterval(interval);
      setIsUploading(false);
      setIsImportOpen(false);
      toast.success("Explosión de insumos importada", {
        description: `Se han actualizado ${materials.length + 5} materiales desde ${file.name}`
      });
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-100">
                <Package className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-xs text-slate-500">Materiales Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={stats.withDeviation > 0 ? "border-red-200 bg-red-50/50" : "border-slate-200"}>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stats.withDeviation > 0 ? 'bg-red-100' : 'bg-slate-100'}`}>
                <AlertTriangle className={`h-4 w-4 ${stats.withDeviation > 0 ? 'text-red-600' : 'text-slate-600'}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${stats.withDeviation > 0 ? 'text-red-700' : 'text-slate-900'}`}>
                  {stats.withDeviation}
                </p>
                <p className={`text-xs ${stats.withDeviation > 0 ? 'text-red-600' : 'text-slate-500'}`}>
                  Con Desviación
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <ArrowRightLeft className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {Math.round((stats.totalRequested / stats.totalPlanned) * 100) || 0}%
                </p>
                <p className="text-xs text-slate-500">Consumo Global</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Materiales */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between gap-4 py-5 border-b border-slate-100">
          <div className="space-y-1">
            <CardTitle>Explosión de Insumos</CardTitle>
            <CardDescription>Gestión y control de materiales del proyecto</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar material..." 
                className="pl-9 bg-slate-50 border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Sheet open={isImportOpen} onOpenChange={setIsImportOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 border-slate-200">
                  <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                  <span className="hidden sm:inline">Importar</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Importar Explosión de Insumos</SheetTitle>
                  <SheetDescription>
                    Sube tu archivo para actualizar el inventario planeado.
                    Formatos soportados: .xlsx, .csv
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-8">
                  <FileUpload 
                    accept=".xlsx,.csv"
                    onFileSelect={handleFileSelect}
                    isUploading={isUploading}
                    uploadProgress={uploadProgress}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead className="text-right">Planeado</TableHead>
                <TableHead className="text-right">Solicitado</TableHead>
                <TableHead className="text-right">Disponible</TableHead>
                <TableHead className="text-center">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaterials.length > 0 ? (
                filteredMaterials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium text-slate-700">
                      {material.name}
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs uppercase">
                      {material.unit}
                    </TableCell>
                    <TableCell className="text-right text-slate-600 font-medium">
                      {material.plannedQuantity}
                    </TableCell>
                    <TableCell className="text-right text-slate-600">
                      {material.requestedQuantity}
                    </TableCell>
                    <TableCell className={
                      `text-right font-bold ${material.availableQuantity < 0 ? 'text-red-600' : 'text-emerald-600'}`
                    }>
                      {material.availableQuantity}
                    </TableCell>
                    <TableCell className="text-center">
                      {material.hasDeviation ? (
                        <Badge variant="destructive" className="text-[10px] gap-1 px-2">
                          <AlertTriangle className="h-3 w-3" />
                          Excedido
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] text-emerald-600 bg-emerald-50 border-emerald-200 gap-1 px-2">
                          <CheckCircle2 className="h-3 w-3" />
                          OK
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-slate-400">
                    No se encontraron materiales.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
