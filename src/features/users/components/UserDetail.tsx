/**
 * User detail drawer component
 * Shows comprehensive user information in a side panel
 */
"use client";

import { motion } from "motion/react";
import {
  Mail,
  Phone,
  Globe,
  Calendar,
  Clock,
  UserCircle,
  Edit,
  UserX,
  UserCheck,
  FolderKanban,
  Activity,
} from "lucide-react";
import type { User } from "@/lib/mock/types";
import { roleLabels } from "@/lib/mock/types";
import { getUserProjectsWithDetails } from "@/lib/mock/project-members";
import { getUserById } from "@/lib/mock/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { UserRoleBadge } from "./UserRoleBadge";
import { UserStatusBadge } from "./UserStatusIndicator";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface UserDetailProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (user: User) => void;
  onToggleStatus?: (user: User) => void;
}

export function UserDetail({
  user,
  open,
  onOpenChange,
  onEdit,
  onToggleStatus,
}: UserDetailProps) {
  if (!user) return null;

  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Get user's projects
  const userProjects = getUserProjectsWithDetails(user.id);

  // Get who invited this user
  const invitedByUser = user.invitedBy ? getUserById(user.invitedBy) : null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[95vh]">
        <ScrollArea className="h-full max-h-[calc(95vh-2rem)]">
          <div className="mx-auto w-full max-w-lg px-4 pb-6">
            <DrawerHeader className="text-center pb-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-4"
              >
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="h-24 w-24 ring-4 ring-white shadow-xl">
                    <AvatarImage
                      src={user.profilePictureUrl}
                      alt={user.fullName}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-4 border-white",
                        user.isActive ? "bg-success" : "bg-muted-foreground"
                      )}
                    />
                  </div>
                </div>

                {/* Name and Role */}
                <div className="text-center">
                  <DrawerTitle className="text-xl font-bold text-foreground">
                    {user.fullName}
                  </DrawerTitle>
                  <DrawerDescription className="text-muted-foreground">
                    {user.email}
                  </DrawerDescription>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2">
                  <UserRoleBadge role={user.role} />
                  <UserStatusBadge isActive={user.isActive} />
                </div>
              </motion.div>
            </DrawerHeader>

            <Separator className="my-4" />

            {/* Tabs */}
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-4">
                <TabsTrigger value="info" className="text-sm">
                  <UserCircle className="h-4 w-4 mr-1.5" />
                  Info
                </TabsTrigger>
                <TabsTrigger value="projects" className="text-sm">
                  <FolderKanban className="h-4 w-4 mr-1.5" />
                  Proyectos
                </TabsTrigger>
                <TabsTrigger value="activity" className="text-sm">
                  <Activity className="h-4 w-4 mr-1.5" />
                  Actividad
                </TabsTrigger>
              </TabsList>

              {/* Info Tab */}
              <TabsContent value="info">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <InfoItem
                    icon={<Mail className="h-4 w-4" />}
                    label="Email"
                    value={user.email}
                  />
                  <InfoItem
                    icon={<Phone className="h-4 w-4" />}
                    label="Teléfono"
                    value={user.phone || "No especificado"}
                  />
                  <InfoItem
                    icon={<Globe className="h-4 w-4" />}
                    label="Zona horaria"
                    value={user.timezone}
                  />
                  <InfoItem
                    icon={<Calendar className="h-4 w-4" />}
                    label="Miembro desde"
                    value={format(new Date(user.createdAt), "d 'de' MMMM, yyyy", {
                      locale: es,
                    })}
                  />
                  <InfoItem
                    icon={<Clock className="h-4 w-4" />}
                    label="Último acceso"
                    value={
                      user.lastLogin
                        ? `Hace ${formatDistanceToNow(new Date(user.lastLogin), {
                            locale: es,
                          })}`
                        : "Nunca"
                    }
                  />
                  <InfoItem
                    icon={<UserCircle className="h-4 w-4" />}
                    label="Invitado por"
                    value={invitedByUser?.fullName || "Usuario original"}
                  />
                </motion.div>
              </TabsContent>

              {/* Projects Tab */}
              <TabsContent value="projects">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {userProjects.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FolderKanban className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No tiene proyectos asignados</p>
                    </div>
                  ) : (
                    <Accordion type="single" collapsible className="space-y-2">
                      {userProjects.map(({ member, project }, index) => (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <AccordionItem
                            value={member.id}
                            className="border rounded-xl px-4 bg-card"
                          >
                            <AccordionTrigger className="hover:no-underline py-3">
                              <div className="flex items-center gap-3 text-left">
                                <div
                                  className={cn(
                                    "w-2 h-2 rounded-full",
                                    project?.status === "ACTIVE"
                                      ? "bg-success"
                                      : project?.status === "PAUSED"
                                      ? "bg-warning"
                                      : "bg-muted-foreground"
                                  )}
                                />
                                <div>
                                  <p className="font-medium text-foreground">
                                    {project?.name || "Proyecto desconocido"}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {roleLabels[member.assignedRole]}
                                  </p>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-3">
                              <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex justify-between">
                                  <span>Ubicación</span>
                                  <span className="text-foreground">
                                    {project?.location}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Asignado</span>
                                  <span className="text-foreground">
                                    {format(
                                      new Date(member.assignedAt),
                                      "d MMM yyyy",
                                      { locale: es }
                                    )}
                                  </span>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </motion.div>
                      ))}
                    </Accordion>
                  )}
                </motion.div>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-8 text-muted-foreground"
                >
                  <Activity className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Historial de actividad próximamente</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Se mostrará el registro de acciones del usuario
                  </p>
                </motion.div>
              </TabsContent>
            </Tabs>

            {/* Footer Actions */}
            <DrawerFooter className="pt-6">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => onEdit?.(user)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
                <Button
                  variant={user.isActive ? "destructive" : "default"}
                  size="lg"
                  className={cn(
                    "flex-1",
                    !user.isActive && "bg-success hover:bg-success/90"
                  )}
                  onClick={() => onToggleStatus?.(user)}
                >
                  {user.isActive ? (
                    <>
                      <UserX className="h-4 w-4 mr-2" />
                      Desactivar
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Activar
                    </>
                  )}
                </Button>
              </div>
            </DrawerFooter>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}

// Helper component for info items
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
      <div className="p-2 rounded-lg bg-background shadow-sm text-muted-foreground">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}
