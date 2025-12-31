/**
 * User status confirmation dialog
 * AlertDialog for confirming activate/deactivate actions
 */
"use client";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/lib/mock/types";
import { UserX, UserCheck, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserStatusConfirmDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function UserStatusConfirmDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
}: UserStatusConfirmDialogProps) {
  if (!user) return null;

  const isDeactivating = user.isActive;

  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-2 rounded-xl",
                isDeactivating ? "bg-red-100" : "bg-emerald-100"
              )}
            >
              {isDeactivating ? (
                <UserX className="h-5 w-5 text-red-600" />
              ) : (
                <UserCheck className="h-5 w-5 text-emerald-600" />
              )}
            </div>
            <AlertDialogTitle>
              {isDeactivating ? "Desactivar Usuario" : "Activar Usuario"}
            </AlertDialogTitle>
          </div>
        </AlertDialogHeader>

        {/* User Preview */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 my-2">
          <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
            <AvatarImage src={user.profilePictureUrl} alt={user.fullName} />
            <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900">{user.fullName}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <AlertDialogDescription>
          {isDeactivating ? (
            <>
              El usuario <span className="font-semibold">{user.fullName}</span> no
              podrá acceder al sistema hasta ser reactivado.
              <br />
              <br />
              <span className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="h-4 w-4" />
                Su historial de actividad se conservará.
              </span>
            </>
          ) : (
            <>
              El usuario <span className="font-semibold">{user.fullName}</span>{" "}
              podrá volver a acceder al sistema con sus credenciales anteriores.
            </>
          )}
        </AlertDialogDescription>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(
              isDeactivating
                ? "bg-red-600 hover:bg-red-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            )}
          >
            {isDeactivating ? (
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
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
