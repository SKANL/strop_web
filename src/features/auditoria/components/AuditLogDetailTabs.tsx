/**
 * Componente de tabs para detalle de log
 * Wrapper para evitar problemas de SSR con Radix UI Tabs
 */

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AuditActionBadge } from "./AuditActionBadge";
import { AuditResourceBadge } from "./AuditResourceBadge";
import { AuditTimeline } from "./AuditTimeline";
import type { AuditLog } from "@/lib/mock/types";
import { parseUserAgent } from "../utils/formatters";

interface AuditLogDetailTabsProps {
  log: AuditLog;
  userName: string;
  userEmail?: string;
  userRole?: string;
  userAvatar?: string;
}

export function AuditLogDetailTabs({
  log,
  userName,
  userEmail,
  userRole,
  userAvatar,
}: AuditLogDetailTabsProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Tabs defaultValue="overview" className="w-full">
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
                  <AuditResourceBadge type={log.resourceType} id={log.resourceId} />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-muted-foreground">Usuario</Label>
              <div className="flex items-center gap-3 mt-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userAvatar} />
                  <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{userName}</div>
                  <div className="text-sm text-muted-foreground">
                    {userEmail || "—"} · {userRole || "Sistema"}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Dirección IP</Label>
                <div className="mt-1 font-mono text-sm">{log.ipAddress || "—"}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Dispositivo</Label>
                <div className="mt-1 text-sm">{parseUserAgent(log.userAgent)}</div>
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
            <ScrollArea className="h-[400px]">
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
            <CardTitle className="text-base">Historial del Recurso</CardTitle>
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
  );
}
