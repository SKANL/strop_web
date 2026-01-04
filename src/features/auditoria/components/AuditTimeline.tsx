/**
 * Timeline visual de eventos relacionados a un recurso
 * Muestra historial cronológico con agrupación por fecha
 */

"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuditResourceType } from "@/lib/mock/types";
import { getAuditLogsForResource } from "@/lib/mock/audit-logs";
import { getUserById } from "@/lib/mock/users";
import { AuditActionBadge } from "./AuditActionBadge";
import { groupLogsByDate } from "../utils/grouping";
import {
  formatDate,
  formatTime,
  formatActionDescription,
  getActionColor,
} from "../utils/formatters";

interface AuditTimelineProps {
  resourceType: AuditResourceType;
  resourceId: string;
  highlightLogId?: string;
}

export function AuditTimeline({
  resourceType,
  resourceId,
  highlightLogId,
}: AuditTimelineProps) {
  const logs = getAuditLogsForResource(resourceType, resourceId);
  const groupedLogs = groupLogsByDate(logs);

  const getUserInfo = (userId?: string) => {
    if (!userId) return { name: "Sistema", avatar: undefined };
    const user = getUserById(userId);
    return {
      name: user?.fullName || "Usuario Desconocido",
      avatar: user?.profilePictureUrl,
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

  if (logs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No hay historial disponible para este recurso.
      </p>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-8">
        {Object.entries(groupedLogs).map(([date, dateLogs]) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-sm font-medium text-muted-foreground">
                {formatDate(date)}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-4 relative pl-6 border-l-2 border-border">
              {dateLogs.map((log, index) => {
                const userInfo = getUserInfo(log.userId);

                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "relative",
                      log.id === highlightLogId &&
                        "ring-2 ring-primary rounded-lg p-2"
                    )}
                  >
                    {/* Dot indicator */}
                    <div className="absolute -left-[29px] top-2">
                       <StatusBadge status={getActionColor(log.action)} className="h-4 w-4 rounded-full p-0 border-2 border-background" />
                    </div>

                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={userInfo.avatar} />
                        <AvatarFallback>{getInitials(userInfo.name)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">
                            {userInfo.name}
                          </span>
                          <StatusBadge status={getActionColor(log.action)} label={log.action} />
                          <span className="text-xs text-muted-foreground">
                            {formatTime(log.createdAt)}
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {formatActionDescription(log)}
                        </p>

                        {log.details && Object.keys(log.details).length > 0 && (
                          <Collapsible>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 px-2">
                                Ver detalles
                                <ChevronDown className="ml-1 h-3 w-3" />
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-x-auto">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </CollapsibleContent>
                          </Collapsible>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
