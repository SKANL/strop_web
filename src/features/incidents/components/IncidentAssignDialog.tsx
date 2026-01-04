/**
 * Dialog para asignar responsable a una incidencia
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus } from "lucide-react";
import type { IncidentWithDetails, ProjectMemberWithDetails } from "@/lib/mock/types";
import { getProjectMembersWithDetailsUI } from "@/lib/mock/project-members";

interface IncidentAssignDialogProps {
  incident: IncidentWithDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (userId: string, note?: string) => void;
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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function IncidentAssignDialog({
  incident,
  open,
  onOpenChange,
  onAssign,
}: IncidentAssignDialogProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [note, setNote] = useState("");

  // Get members of the project with details
  const projectMembers: ProjectMemberWithDetails[] = getProjectMembersWithDetailsUI(incident.projectId);

  const handleAssign = () => {
    if (selectedUserId) {
      onAssign(selectedUserId, note || undefined);
      setSelectedUserId("");
      setNote("");
    }
  };

  const selectedMember = projectMembers.find((m) => m.userId === selectedUserId);

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
              <UserPlus className="size-5" />
              Asignar Responsable
            </AlertDialogTitle>
            <AlertDialogDescription>
              Selecciona el usuario que será responsable de resolver esta incidencia.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            {/* User Select */}
            <div className="space-y-2">
              <Label htmlFor="assignee">Responsable</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger id="assignee">
                  <SelectValue placeholder="Seleccionar usuario..." />
                </SelectTrigger>
                <SelectContent>
                  {projectMembers.map((member) => (
                    <SelectItem key={member.userId} value={member.userId}>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6">
                          <AvatarImage src={member.userAvatar} />
                          <AvatarFallback className="text-xs">
                            {getInitials(member.userName)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{member.userName}</span>
                        <span className="text-muted-foreground text-xs">
                          ({member.assignedRole})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Preview Selected User */}
            {selectedMember && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
              >
                <Avatar className="size-10">
                  <AvatarImage src={selectedMember.userAvatar} />
                  <AvatarFallback>
                    {getInitials(selectedMember.userName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{selectedMember.userName}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedMember.userEmail}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Optional Note */}
            <div className="space-y-2">
              <Label htmlFor="assign-note">Nota de asignación (opcional)</Label>
              <Textarea
                id="assign-note"
                placeholder="Instrucciones adicionales para el responsable..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setSelectedUserId("");
              setNote("");
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAssign}
              disabled={!selectedUserId}
            >
              Asignar
            </AlertDialogAction>
          </AlertDialogFooter>
        </motion.div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
