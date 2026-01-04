// components/dashboard/projects/detail/ProjectMembersTab.tsx - Tab de miembros del proyecto
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Search, 
  UserMinus, 
  Mail,
  Phone,
  Calendar,
  AlertTriangle
} from "lucide-react";
import type { ProjectMemberWithDetails, ProjectRole } from "@/lib/mock/types";
import { mockUsers } from "@/lib/mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { EmptyState } from "@/components/shared/empty-state";

interface ProjectMembersTabProps {
  projectId: string;
  members: ProjectMemberWithDetails[];
}

const roleLabels: Record<ProjectRole, string> = {
  SUPERINTENDENT: "Superintendente",
  RESIDENT: "Residente",
  CABO: "Cabo",
};

const roleColors: Record<ProjectRole, { bg: string; text: string; border: string }> = {
  SUPERINTENDENT: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
  RESIDENT: { bg: "bg-info/10", text: "text-info", border: "border-info/20" },
  CABO: { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" },
};

export function ProjectMembersTab({ projectId, members }: ProjectMembersTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<ProjectRole | "">("");
  const [selectedUser, setSelectedUser] = useState("");

  const filteredMembers = members.filter((member) =>
    member.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Usuarios disponibles para agregar (que no están ya asignados)
  const assignedUserIds = members.map(m => m.userId);
  const availableUsers = mockUsers.filter(
    u => !assignedUserIds.includes(u.id) && u.isActive && u.role !== "OWNER"
  );

  return (
    <div className="space-y-6">
      {/* Header con búsqueda y acciones */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 justify-between"
      >
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar miembro..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            inputSize="lg"
            className="pl-10"
          />
        </div>

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Agregar Miembro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Agregar Miembro al Proyecto</DialogTitle>
              <DialogDescription>
                Selecciona un usuario y asígnale un rol en este proyecto.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Usuario</label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Selecciona un usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.length > 0 ? (
                      availableUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={user.profilePictureUrl} />
                              <AvatarFallback className="text-xs">
                                {getInitials(user.fullName)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{user.fullName}</span>
                            <Badge variant="outline" size="sm" className="ml-auto">
                              {user.role}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No hay usuarios disponibles
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Rol en el Proyecto</label>
                <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as ProjectRole)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUPERINTENDENT">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        Superintendente
                      </div>
                    </SelectItem>
                    <SelectItem value="RESIDENT">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-info" />
                        Residente
                      </div>
                    </SelectItem>
                    <SelectItem value="CABO">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                        Cabo
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90"
                disabled={!selectedUser || !selectedRole}
              >
                Agregar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Tabla de miembros - Diseño limpio */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="rounded-2xl border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 border-b border-border">
                <TableHead className="font-bold text-foreground text-xs uppercase tracking-wider py-4">
                  Usuario
                </TableHead>
                <TableHead className="font-bold text-foreground text-xs uppercase tracking-wider">
                  Rol
                </TableHead>
                <TableHead className="font-bold text-foreground text-xs uppercase tracking-wider hidden md:table-cell">
                  Asignado
                </TableHead>
                <TableHead className="w-16 text-right font-bold text-foreground text-xs uppercase tracking-wider">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredMembers.map((member, index) => {
                  const colors = roleColors[member.assignedRole];
                  return (
                    <motion.tr
                      key={member.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className="group hover:bg-muted/50 border-b border-border last:border-0"
                    >
                      <TableCell className="py-3">
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <div className="flex items-center gap-3 cursor-pointer">
                              <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
                                <AvatarImage src={member.userAvatar} alt={member.userName} />
                                <AvatarFallback className="text-xs bg-primary text-primary-foreground font-medium">
                                  {getInitials(member.userName)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-foreground">{member.userName}</p>
                                <p className="text-xs text-muted-foreground">{member.userEmail}</p>
                              </div>
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={member.userAvatar} />
                                  <AvatarFallback className="bg-primary text-primary-foreground">
                                    {getInitials(member.userName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold">{member.userName}</p>
                                  <Badge 
                                    variant="outline"
                                    className={`${colors.bg} ${colors.text} ${colors.border}`}
                                  >
                                    {roleLabels[member.assignedRole]}
                                  </Badge>
                                </div>
                              </div>
                              <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  {member.userEmail}
                                </div>
                                {member.userPhone && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    {member.userPhone}
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  Asignado el {formatDate(member.assignedAt)}
                                </div>
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </TableCell>
                      <TableCell>
                        {/* Select para cambiar rol inline */}
                        <Select defaultValue={member.assignedRole}>
                          <SelectTrigger className={`w-40 h-8 rounded-lg text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border} hover:opacity-80`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SUPERINTENDENT">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary" />
                                Superintendente
                              </div>
                            </SelectItem>
                            <SelectItem value="RESIDENT">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-info" />
                                Residente
                              </div>
                            </SelectItem>
                            <SelectItem value="CABO">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                                Cabo
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {formatDate(member.assignedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <div className="flex items-center gap-3 mb-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                                  <AlertTriangle className="h-5 w-5 text-destructive" />
                                </div>
                                <AlertDialogTitle>Quitar miembro del proyecto</AlertDialogTitle>
                              </div>
                              <AlertDialogDescription className="text-left">
                                ¿Estás seguro de que deseas quitar a <strong>{member.userName}</strong> del proyecto?
                                <p className="mt-2 text-muted-foreground">
                                  El usuario perderá acceso a este proyecto y no podrá ver ni gestionar incidencias.
                                </p>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-destructive hover:bg-destructive/90 focus:ring-destructive"
                                onClick={() => {
                                  // TODO: Implementar eliminación real
                                  console.log("Quitar miembro:", member.userId);
                                }}
                              >
                                Sí, quitar miembro
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </TableBody>
          </Table>

          {filteredMembers.length === 0 && (
            <EmptyState
              icon={Search}
              title="No se encontraron miembros"
              description="Intenta modificar tu búsqueda"
              className="py-12"
            />
          )}
        </Card>
      </motion.div>
    </div>
  );
}
