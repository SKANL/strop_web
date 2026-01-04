// islands/ActivityFeed.tsx - Feed de actividad
"use client";

import { motion } from "motion/react";
import { Activity as ActivityIcon, AlertTriangle, FolderKanban, Users, Settings, ChevronRight } from "lucide-react";
import type { ActivityUI } from "@/lib/mock";
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ActivityFeedProps {
  activities: ActivityUI[];
  maxItems?: number;
}

export function ActivityFeed({ activities, maxItems = 8 }: ActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems);

  const getActivityIcon = (type: ActivityUI["type"]) => {
    switch (type) {
      case "incident":
        return AlertTriangle;
      case "project":
        return FolderKanban;
      case "user":
        return Users;
      case "system":
        return Settings;
      default:
        return ActivityIcon;
    }
  };

  const getActivityColor = (type: ActivityUI["type"]) => {
    switch (type) {
      case "incident":
        return "bg-warning/20 text-warning";
      case "project":
        return "bg-primary/10 text-primary";
      case "user":
        return "bg-success/10 text-success";
      case "system":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getActivityBadgeColor = (type: ActivityUI["type"]) => {
    switch (type) {
      case "incident":
        return "bg-warning/10 text-warning border-warning/20";
      case "project":
        return "bg-primary/10 text-primary border-primary/20";
      case "user":
        return "bg-success/10 text-success border-success/20";
      case "system":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <Card className="rounded-3xl border-border shadow-sm py-0 gap-0 h-full">
      <CardHeader className="p-4 pb-3 border-b-0">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10">
            <ActivityIcon className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-sm font-semibold text-foreground">Actividad</CardTitle>
        </div>
        <CardAction>
          <a href="/dashboard/auditoria" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5">
            Ver todo <ChevronRight className="h-3 w-3" />
          </a>
        </CardAction>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-0">
        <ScrollArea className="h-52 pr-2">
          <div className="space-y-0.5">
            {displayActivities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15, delay: index * 0.02 }}
                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted transition-colors cursor-default"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {activity.userAvatar ? (
                        <Avatar className="h-6 w-6 shrink-0">
                          <AvatarImage src={activity.userAvatar} alt={activity.user} />
                          <AvatarFallback className="text-xs bg-muted">{getInitials(activity.user)}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className={`p-1.5 rounded-lg shrink-0 ${getActivityColor(activity.type)}`}>
                          <Icon className="h-3 w-3" />
                        </div>
                      )}
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p className="text-xs">{activity.user}</p>
                    </TooltipContent>
                  </Tooltip>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground truncate">
                      <span className="font-medium text-foreground">{activity.user}</span>
                      <span> {activity.action} </span>
                      <span className="font-medium">{activity.target}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge variant="outline" size="sm" className={`${getActivityBadgeColor(activity.type)}`}>
                      {activity.type === "incident" ? "Inc" : activity.type === "project" ? "Proy" : activity.type === "user" ? "Usr" : "Sys"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
