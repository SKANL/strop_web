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
import { LuckySheetMapper } from "../import/LuckySheetMapper";

import type { MaterialWithStats } from "@/lib/mock/types";

interface ProjectMaterialsTabProps {
  materials: MaterialWithStats[];
  projectId?: string;
}

export function ProjectMaterialsTab({ materials, projectId = "mock-project-id" }: ProjectMaterialsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isImportOpen, setIsImportOpen] = useState(false);

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

  // Handle successful import
  const handleImportSuccess = (data: Record<string, unknown>[]) => {
    console.log("Imported materials:", data);
    // TODO: In real implementation, this would update the materials via a store or refetch
    setIsImportOpen(false);
    toast.success("Materiales importados", {
      description: `Se importaron ${data.length} materiales exitosamente`,
    });
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Package className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Materiales Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={stats.withDeviation > 0 ? "border-destructive/20 bg-destructive/5" : "border-border"}>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stats.withDeviation > 0 ? 'bg-destructive/10' : 'bg-muted'}`}>
                <AlertTriangle className={`h-4 w-4 ${stats.withDeviation > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${stats.withDeviation > 0 ? 'text-destructive' : 'text-foreground'}`}>
                  {stats.withDeviation}
                </p>
                <p className={`text-xs ${stats.withDeviation > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  Con Desviación
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <ArrowRightLeft className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round((stats.totalRequested / stats.totalPlanned) * 100) || 0}%
                </p>
                <p className="text-xs text-muted-foreground">Consumo Global</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Materiales */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between gap-4 py-5 border-b border-border">
          <div className="space-y-1">
            <CardTitle>Explosión de Insumos</CardTitle>
            <CardDescription>Gestión y control de materiales del proyecto</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar material..." 
                className="pl-9 bg-muted/50 border-border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button 
              variant="outline" 
              className="gap-2 border-border"
              onClick={() => setIsImportOpen(true)}
            >
              <FileSpreadsheet className="h-4 w-4 text-success" />
              <span className="hidden sm:inline">Importar</span>
            </Button>
            
            <LuckySheetMapper
              type="materials"
              projectId={projectId}
              isOpen={isImportOpen}
              onOpenChange={setIsImportOpen}
              onSuccess={handleImportSuccess}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
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
                    <TableCell className="font-medium text-foreground">
                      {material.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs uppercase">
                      {material.unit}
                    </TableCell>
                    <TableCell className="text-right text-foreground font-medium">
                      {material.plannedQuantity}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {material.requestedQuantity}
                    </TableCell>
                    <TableCell className={
                      `text-right font-bold ${material.availableQuantity < 0 ? 'text-destructive' : 'text-success'}`
                    }>
                      {material.availableQuantity}
                    </TableCell>
                    <TableCell className="text-center">
                      {material.hasDeviation ? (
                        <Badge variant="destructive" size="sm" className="gap-1 px-2">
                          <AlertTriangle className="h-3 w-3" />
                          Excedido
                        </Badge>
                      ) : (
                        <Badge variant="outline" size="sm" className="text-success bg-success/10 border-success/20 gap-1 px-2">
                          <CheckCircle2 className="h-3 w-3" />
                          OK
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
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
