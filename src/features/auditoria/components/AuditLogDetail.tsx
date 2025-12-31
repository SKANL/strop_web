/**
 * Dialog modal para mostrar detalles completos de un log
 * Incluye tabs para diferentes vistas y opción de abrir en nueva pestaña
 */

"use client";

import { useStore } from "@nanostores/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ExternalLink } from "lucide-react";
import { selectedLogIdStore, isDetailModalOpenStore, closeDetailModal } from "../stores/auditSelection";
import { getAuditLogById } from "@/lib/mock/audit-logs";
import { getUserById } from "@/lib/mock/users";
import { roleLabels } from "@/lib/mock/types";
import { AuditActionBadge } from "./AuditActionBadge";
import { AuditResourceBadge } from "./AuditResourceBadge";
import { AuditTimeline } from "./AuditTimeline";
import { formatDateTime, parseUserAgent } from "../utils/formatters";

export function AuditLogDetail() {
  const selectedLogId = useStore(selectedLogIdStore);
  const isOpen = useStore(isDetailModalOpenStore);

  if (!selectedLogId) return null;

  const log = getAuditLogById(selectedLogId);
  if (!log) return null;

  const user = log.userId ? getUserById(log.userId) : null;

  const getInitials = (name?: string) => {
    if (!name) return "SY";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleOpenInNewTab = () => {
    window.open(`/dashboard/auditoria/${log.id}`, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeDetailModal()}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent className="max-w-3xl max-h-[80vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AuditActionBadge action={log.action} />
                  <span>Detalle de Auditoría</span>
                </DialogTitle>
                <DialogDescription>
                  {formatDateTime(log.createdAt)} · Log ID: {log.id}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="overview" className="w-full mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Resumen</TabsTrigger>
                  <TabsTrigger value="details">Detalles</TabsTrigger>
                  <TabsTrigger value="context">Contexto</TabsTrigger>
                </TabsList>

                {/* Tab: Resumen */}
                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Información General</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground">Acción</Label>
                          <div className="mt-1">
                            <AuditActionBadge action={log.action} />
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Recurso</Label>
                          <div className="mt-1">
                            <AuditResourceBadge
                              type={log.resourceType}
                              id={log.resourceId}
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <Label className="text-muted-foreground">Usuario</Label>
                        <div className="flex items-center gap-3 mt-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user?.profilePictureUrl} />
                            <AvatarFallback>
                              {getInitials(user?.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {user?.fullName || "Sistema"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {user?.email || "—"} ·{" "}
                              {user?.role ? roleLabels[user.role] : "Sistema"}
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground">Dirección IP</Label>
                          <div className="mt-1 font-mono text-sm">
                            {log.ipAddress || "—"}
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Dispositivo</Label>
                          <div className="mt-1 text-sm">
                            {parseUserAgent(log.userAgent)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab: Detalles */}
                <TabsContent value="details">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Detalles de la Acción</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px]">
                        <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab: Contexto */}
                <TabsContent value="context">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Historial del Recurso
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {log.resourceType && log.resourceId ? (
                        <AuditTimeline
                          resourceType={log.resourceType}
                          resourceId={log.resourceId}
                          highlightLogId={log.id}
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No hay recurso asociado para mostrar historial.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Acciones */}
              <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                <Button variant="outline" onClick={handleOpenInNewTab}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Abrir en Nueva Pestaña
                </Button>
                <Button onClick={() => closeDetailModal()}>Cerrar</Button>
              </div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
