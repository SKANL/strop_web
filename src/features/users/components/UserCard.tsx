/**
 * User card component for grid view
 * Displays user information in a card format
 */
"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  MoreVertical, 
  Mail, 
  Phone, 
  Calendar, 
  Edit, 
  UserX, 
  UserCheck,
  Eye 
} from "lucide-react";
import type { User } from "@/lib/mock/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserRoleBadge } from "./UserRoleBadge";
import { UserStatusIndicator } from "./UserStatusIndicator";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface UserCardProps {
  user: User;
  index?: number;
  onView?: (user: User) => void;
  onEdit?: (user: User) => void;
  onToggleStatus?: (user: User) => void;
}

export function UserCard({
  user,
  index = 0,
  onView,
  onEdit,
  onToggleStatus,
}: UserCardProps) {
  // Use client-side only rendering for time-based values to avoid hydration mismatch
  const [lastLoginText, setLastLoginText] = useState<string>("—");
  
  useEffect(() => {
    setLastLoginText(
      user.lastLogin
        ? `Hace ${formatDistanceToNow(new Date(user.lastLogin), { locale: es })}`
        : "Nunca"
    );
  }, [user.lastLogin]);

  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        type: "spring",
        bounce: 0.2,
      }}
    >
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-200",
          "hover:shadow-lg hover:shadow-muted hover:border-border",
          "cursor-pointer",
          !user.isActive && "opacity-70"
        )}
        onClick={() => onView?.(user)}
      >
        <CardContent className="p-4">
          {/* Header with Avatar and Actions */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12 ring-2 ring-white shadow-md">
                  <AvatarImage src={user.profilePictureUrl} alt={user.fullName} />
                  <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5">
                  <UserStatusIndicator isActive={user.isActive} size="sm" />
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground truncate">
                  {user.fullName}
                </h3>
                <UserRoleBadge role={user.role} size="sm" />
              </div>
            </div>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onView?.(user)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalles
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(user)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onToggleStatus?.(user)}
                  className={user.isActive ? "text-destructive" : "text-success"}
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
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Contact Info */}
          <div className="space-y-1.5 text-sm text-muted-foreground">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 truncate">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>{user.email}</TooltipContent>
            </Tooltip>

            {user.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{user.phone}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs">Último acceso: {lastLoginText}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
