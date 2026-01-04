/**
 * Detail Sheet for viewing full log information
 * With tabs for Evidence, Location, Integrity, History
 */

"use client";

import { useStore } from "@nanostores/react";
import { motion } from "motion/react";
import {
  Image,
  MapPin,
  Link2,
  History,
  Clock,
  User,
  FileText,
  Copy,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { $detailLogId, closeDetail } from "../stores/bitacoraStore";
import { getOperationalLogById, isExtemporaneous } from "@/lib/mock/operational-logs";
import { categoryLabels, categoryColors, statusLabels } from "../types";

export function LogDetailSheet() {
  const detailLogId = useStore($detailLogId);
  const log = detailLogId ? getOperationalLogById(detailLogId) : null;

  if (!log) return null;

  const isLate = isExtemporaneous(log);

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("es-MX", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sheet open={!!detailLogId} onOpenChange={(open) => !open && closeDetail()}>
      <SheetContent className="w-[500px] sm:w-[600px] p-0 flex flex-col h-full bg-card shadow-2xl border-l border-border">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(categoryColors[log.category])}
            >
              {categoryLabels[log.category]}
            </Badge>
            <Badge variant="secondary">{statusLabels[log.status]}</Badge>
            {isLate && (
              <Badge className="bg-warning/20 text-warning">Extemporáneo</Badge>
            )}
          </div>
          <SheetTitle className="text-left">
            #{log.folio} - {log.content.title}
          </SheetTitle>
          <SheetDescription className="text-left">
            {log.content.description}
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-4" />

        {/* Author and timestamp info */}
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={log.author.avatar} />
            <AvatarFallback>{getInitials(log.author.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium">{log.author.name}</p>
            <p className="text-sm text-muted-foreground">{log.author.role}</p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDateTime(log.userDate)}
            </div>
          </div>
        </div>

        <Tabs defaultValue="evidence" className="flex-1">
          <TabsList className="w-full">
            <TabsTrigger value="evidence" className="flex-1 gap-1">
              <Image className="h-3 w-3" />
              Evidencia
            </TabsTrigger>
            <TabsTrigger value="location" className="flex-1 gap-1">
              <MapPin className="h-3 w-3" />
              Ubicación
            </TabsTrigger>
            <TabsTrigger value="integrity" className="flex-1 gap-1">
              <Link2 className="h-3 w-3" />
              Integridad
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1 gap-1">
              <History className="h-3 w-3" />
              Historial
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px] mt-4">
            <TabsContent value="evidence" className="mt-0">
              {log.evidence.photos.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {log.evidence.photos.map((photo, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative aspect-square bg-muted rounded-lg overflow-hidden"
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <Image className="h-8 w-8" />
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs p-2">
                        <p>EXIF: {photo.exifDate.split("T")[0]}</p>
                        <p>GPS: {photo.exifGps.lat.toFixed(4)}, {photo.exifGps.lng.toFixed(4)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Sin evidencia fotográfica</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="location" className="mt-0">
              <div className="space-y-4">
                <div
                  className={cn(
                    "p-4 rounded-lg border",
                    log.gps.inGeofence
                      ? "bg-success/10 border-success/30"
                      : "bg-warning/10 border-warning/30"
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5" />
                    <span className="font-medium">
                      {log.gps.inGeofence ? "Dentro del geofence" : "Fuera del geofence"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Coordenadas: {log.gps.lat.toFixed(6)}, {log.gps.lng.toFixed(6)}
                  </p>
                </div>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">Mapa (placeholder)</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="integrity" className="mt-0">
              <div className="space-y-4">
                <div
                  className={cn(
                    "p-4 rounded-lg border",
                    log.integrity.verified
                      ? "bg-success/10 border-success/30"
                      : "bg-destructive/10 border-destructive/30"
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Link2 className="h-5 w-5" />
                    <span className="font-medium">
                      {log.integrity.verified ? "Cadena verificada" : "Cadena rota"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    La integridad del registro ha sido validada criptográficamente.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Hash anterior</p>
                    <code className="text-xs font-mono break-all">
                      {log.integrity.previousHash}
                    </code>
                  </div>
                  <div className="flex justify-center">
                    <div className="h-6 w-px bg-border" />
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Hash actual</p>
                    <div className="flex items-center justify-between">
                      <code className="text-xs font-mono break-all">
                        {log.integrity.hash}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => navigator.clipboard.writeText(log.integrity.hash)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <div className="space-y-3">
                {/* Mock audit trail */}
                {[
                  { action: "Creado", user: log.author.name, date: log.serverDate },
                  { action: "Publicado", user: log.author.name, date: log.serverDate },
                ].map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="p-2 rounded-full bg-primary/10">
                      <User className="h-3 w-3 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{event.action}</p>
                      <p className="text-xs text-muted-foreground">por {event.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(event.date)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
