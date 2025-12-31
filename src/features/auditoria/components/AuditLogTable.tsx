/**
 * Tabla principal de logs de auditoría
 * React Island con paginación, ordenamiento y selección
 */

"use client";

import { useState } from "react";
import { useStore } from "@nanostores/react";
import { motion } from "framer-motion";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, ExternalLink } from "lucide-react";
import type { AuditLog } from "@/lib/mock/types";
import { AuditActionBadge } from "./AuditActionBadge";
import { AuditResourceBadge } from "./AuditResourceBadge";
import { formatDateTime, formatDetails } from "../utils/formatters";
import { getUserById } from "@/lib/mock/users";
import { selectLog } from "../stores/auditSelection";
import { filteredLogsStore } from "../stores/auditFilters";

interface AuditLogTableProps {
  initialLogs: AuditLog[];
}

export function AuditLogTable({ initialLogs }: AuditLogTableProps) {
  const filteredLogs = useStore(filteredLogsStore);
  const [page, setPage] = useState(1);
  const logsPerPage = 25;

  // Usar logs filtrados si hay filtros activos, sino usar iniciales
  const logs = filteredLogs.length > 0 ? filteredLogs : initialLogs;

  // Paginación
  const totalPages = Math.ceil(logs.length / logsPerPage);
  const startIndex = (page - 1) * logsPerPage;
  const endIndex = Math.min(startIndex + logsPerPage, logs.length);
  const currentLogs = logs.slice(startIndex, endIndex);

  const handleRowClick = (logId: string) => {
    selectLog(logId);
  };

  const handleOpenInNewTab = (logId: string) => {
    window.open(`/dashboard/auditoria/${logId}`, "_blank");
  };

  const getUserInfo = (userId?: string) => {
    if (!userId) return { name: "Sistema", avatar: undefined, role: "SYSTEM" };
    const user = getUserById(userId);
    return {
      name: user?.fullName || "Usuario Desconocido",
      avatar: user?.profilePictureUrl,
      role: user?.role || "UNKNOWN",
    };
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
    <div className="relative">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Fecha y Hora</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Acción</TableHead>
            <TableHead>Recurso</TableHead>
            <TableHead>Detalles</TableHead>
            <TableHead className="w-[120px]">IP</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentLogs.map((log, index) => {
            const userInfo = getUserInfo(log.userId);

            return (
              <motion.tr
                key={log.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                whileHover={{
                  backgroundColor: "hsl(var(--accent))",
                }}
                onClick={() => handleRowClick(log.id)}
                className="cursor-pointer"
              >
                <TableCell className="font-mono text-sm">
                  {formatDateTime(log.createdAt)}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userInfo.avatar} />
                      <AvatarFallback>{getInitials(userInfo.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{userInfo.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {userInfo.role}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <AuditActionBadge action={log.action} />
                </TableCell>

                <TableCell>
                  <AuditResourceBadge type={log.resourceType} id={log.resourceId} />
                </TableCell>

                <TableCell className="max-w-[300px] truncate">
                  {formatDetails(log.details)}
                </TableCell>

                <TableCell className="font-mono text-xs text-muted-foreground">
                  {log.ipAddress || "—"}
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleRowClick(log.id)}>
                        Ver Detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenInNewTab(log.id)}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Abrir en Nueva Pestaña
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>

      {/* Paginación */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Mostrando {startIndex + 1}-{endIndex} de {logs.length} logs
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Anterior
          </Button>
          <div className="flex items-center gap-2 px-3">
            <span className="text-sm">
              Página {page} de {totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
