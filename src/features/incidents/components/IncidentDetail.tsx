/**
 * Vista detallada de incidencia en Sheet lateral
 * Con tabs para información, fotos, timeline
 */

import { motion, AnimatePresence } from "motion/react";
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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IncidentTypeIcon } from "./IncidentTypeIcon";
import { IncidentTimeline } from "./IncidentTimeline";
import { IncidentPhotosGallery } from "./IncidentPhotosGallery";
import { IncidentAssignDialog } from "./IncidentAssignDialog";
import { IncidentCloseDialog } from "./IncidentCloseDialog";
import {
  MapPin,
  Calendar,
  User,
  UserCheck,
  Image,
  History,
  Info,
  UserPlus,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  type IncidentWithDetails,
  incidentTypeLabels,
  priorityLabels,
  statusLabels,
} from "@/lib/mock/types";
import { getPhotosByIncident } from "@/lib/mock/photos";
import { getCommentsByIncidentWithAuthor } from "@/lib/mock/comments";
import { useState } from "react";

interface IncidentDetailProps {
  incident: IncidentWithDetails | null;
  open: boolean;
  onClose: () => void;
}

const priorityColors: Record<string, string> = {
  NORMAL: "bg-secondary text-secondary-foreground",
  CRITICAL: "bg-destructive text-destructive-foreground",
};

const statusColors: Record<string, string> = {
  OPEN: "bg-warning/20 text-warning border-warning/30",
  ASSIGNED: "bg-info/20 text-info border-info/30",
  CLOSED: "bg-success/20 text-success border-success/30",
};

const contentStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function IncidentDetail({ incident, open, onClose }: IncidentDetailProps) {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);

  if (!incident) return null;

  const photos = getPhotosByIncident(incident.id);
  const comments = getCommentsByIncidentWithAuthor(incident.id);
  const canAssign = incident.status === "OPEN";
  const canClose = incident.status !== "CLOSED";

  return (
    <>
      <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <SheetContent className="sm:max-w-xl w-full p-0 flex flex-col h-full bg-card shadow-2xl border-l border-border">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <SheetHeader className="pr-8">
            <div className="flex items-center gap-2 mb-1">
              <IncidentTypeIcon type={incident.type} size={20} />
              <SheetTitle className="text-lg">
                {incidentTypeLabels[incident.type]}
              </SheetTitle>
            </div>
            <SheetDescription className="flex items-center gap-2 flex-wrap">
              <Badge className={priorityColors[incident.priority]}>
                {priorityLabels[incident.priority]}
              </Badge>
              <Badge className={statusColors[incident.status]}>
                {statusLabels[incident.status]}
              </Badge>
              <Badge variant="outline">{incident.projectName}</Badge>
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="flex-1 -mx-6 px-6">
            <motion.div
              variants={contentStagger}
              initial="hidden"
              animate="visible"
              className="space-y-6 py-4"
            >
              {/* Action Buttons */}
              <motion.div variants={itemVariants} className="flex gap-2">
                {canAssign && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setIsAssignDialogOpen(true)}
                  >
                    <UserPlus className="size-4" />
                    Asignar
                  </Button>
                )}
                {canClose && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setIsCloseDialogOpen(true)}
                  >
                    <CheckCircle2 className="size-4" />
                    Cerrar
                  </Button>
                )}
              </motion.div>

              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info" className="gap-1.5">
                    <Info className="size-3.5" />
                    Info
                  </TabsTrigger>
                  <TabsTrigger value="photos" className="gap-1.5">
                    <Image className="size-3.5" />
                    Fotos
                    {photos.length > 0 && (
                      <Badge variant="secondary" size="sm" className="size-5 p-0 justify-center">
                        {photos.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="gap-1.5">
                    <History className="size-3.5" />
                    Bitácora
                  </TabsTrigger>
                </TabsList>

                {/* Tab Contents - no AnimatePresence needed, Tabs handles visibility */}
                <TabsContent value="info" className="mt-4 space-y-4">
                    {/* Description */}
                    <motion.div variants={itemVariants}>
                      <h4 className="text-sm font-medium mb-2">Descripción</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {incident.description}
                      </p>
                    </motion.div>

                    <Separator />

                    {/* Location */}
                    {incident.locationName && (
                      <motion.div variants={itemVariants}>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <MapPin className="size-4" />
                          Ubicación
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {incident.locationName}
                        </p>
                        {incident.gpsLat && incident.gpsLng && (
                          <a
                            href={`https://www.google.com/maps?q=${incident.gpsLat},${incident.gpsLng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                          >
                            Ver en mapa
                            <ExternalLink className="size-3" />
                          </a>
                        )}
                      </motion.div>
                    )}

                    <Separator />

                    {/* Created By */}
                    <motion.div variants={itemVariants}>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <User className="size-4" />
                        Creado por
                      </h4>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarImage src={incident.createdByAvatar} />
                          <AvatarFallback>
                            {getInitials(incident.createdByName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{incident.createdByName}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(incident.createdAt), "d 'de' MMMM yyyy, HH:mm", {
                              locale: es,
                            })}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Assigned To */}
                    {incident.assignedToName && (
                      <>
                        <Separator />
                        <motion.div variants={itemVariants}>
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <UserCheck className="size-4" />
                            Asignado a
                          </h4>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8">
                              <AvatarImage src={incident.assignedToAvatar} />
                              <AvatarFallback>
                                {getInitials(incident.assignedToName)}
                              </AvatarFallback>
                            </Avatar>
                            <p className="text-sm font-medium">{incident.assignedToName}</p>
                          </div>
                        </motion.div>
                      </>
                    )}

                    {/* Closed Info */}
                    {incident.status === "CLOSED" && incident.closedAt && (
                      <>
                        <Separator />
                        <motion.div variants={itemVariants}>
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Calendar className="size-4" />
                            Cerrada
                          </h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            {format(new Date(incident.closedAt), "d 'de' MMMM yyyy, HH:mm", {
                              locale: es,
                            })}
                          </p>
                          {incident.closedNotes && (
                            <div className="bg-muted/50 rounded-lg p-3">
                              <p className="text-sm text-muted-foreground">
                                {incident.closedNotes}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      </>
                    )}

                    {/* Immutable Warning */}
                    {incident.isImmutable && (
                      <motion.div
                        variants={itemVariants}
                        className="bg-warning/10 border border-warning/30 rounded-lg p-3"
                      >
                        <p className="text-xs text-warning">
                          ⚠️ Este registro es inalterable y forma parte de la bitácora digital oficial.
                        </p>
                      </motion.div>
                    )}
                  </TabsContent>

                  <TabsContent value="photos" className="mt-4">
                    <IncidentPhotosGallery photos={photos} />
                  </TabsContent>

                  <TabsContent value="timeline" className="mt-4">
                    <IncidentTimeline incident={incident} comments={comments} />
                  </TabsContent>
              </Tabs>
            </motion.div>
          </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Assignment Dialog */}
      <IncidentAssignDialog
        incident={incident}
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        onAssign={(userId) => {
          console.log("Assigned to:", userId);
          setIsAssignDialogOpen(false);
        }}
      />

      {/* Close Dialog */}
      <IncidentCloseDialog
        incident={incident}
        open={isCloseDialogOpen}
        onOpenChange={setIsCloseDialogOpen}
        onClose={(notes) => {
          console.log("Closed with notes:", notes);
          setIsCloseDialogOpen(false);
        }}
      />
    </>
  );
}
