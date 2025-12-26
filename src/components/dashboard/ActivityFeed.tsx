// ActivityFeed.tsx - Feed de actividad minimalista con shadcn
import { motion } from "framer-motion";
import { Activity as ActivityIcon, AlertTriangle, FolderKanban, Users, Settings, ChevronRight } from "lucide-react";
import type { Activity } from "@/lib/mock-dashboard";
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ActivityFeedProps {
  activities: Activity[];
  maxItems?: number;
}

export function ActivityFeed({ activities, maxItems = 8 }: ActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems);

  const getActivityIcon = (type: Activity["type"]) => {
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

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "incident":
        return "bg-amber-100 text-amber-600";
      case "project":
        return "bg-blue-100 text-blue-600";
      case "user":
        return "bg-green-100 text-green-600";
      case "system":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getActivityBadgeColor = (type: Activity["type"]) => {
    switch (type) {
      case "incident":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "project":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "user":
        return "bg-green-100 text-green-700 border-green-200";
      case "system":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const getActivityTypeLabel = (type: Activity["type"]) => {
    switch (type) {
      case "incident":
        return "Incidencia";
      case "project":
        return "Proyecto";
      case "user":
        return "Usuario";
      case "system":
        return "Sistema";
      default:
        return "Actividad";
    }
  };

  return (
    <Card className="rounded-3xl border-gray-200/60 shadow-sm py-0 gap-0 h-full">
      <CardHeader className="p-4 pb-3 border-b-0">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-100">
            <ActivityIcon className="h-4 w-4 text-purple-600" />
          </div>
          <CardTitle className="text-sm font-semibold text-gray-700">Actividad Reciente</CardTitle>
        </div>
        <CardAction>
          <a href="/dashboard/auditoria" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-0.5">
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
                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50/80 transition-colors cursor-default"
                >
                  {/* Avatar compacto */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {activity.userAvatar ? (
                        <Avatar className="h-6 w-6 shrink-0">
                          <AvatarImage src={activity.userAvatar} alt={activity.user} />
                          <AvatarFallback className="text-[9px] bg-gray-100">{getInitials(activity.user)}</AvatarFallback>
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

                  {/* Content compacto */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-gray-600 truncate">
                      <span className="font-medium text-gray-800">{activity.user}</span>
                      <span> {activity.action} </span>
                      <span className="font-medium">{activity.target}</span>
                    </p>
                  </div>

                  {/* Badge + Time */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge variant="outline" className={`text-[8px] px-1 py-0 h-3.5 ${getActivityBadgeColor(activity.type)}`}>
                      {activity.type === "incident" ? "Inc" : activity.type === "project" ? "Proy" : activity.type === "user" ? "Usr" : "Sys"}
                    </Badge>
                    <span className="text-[9px] text-gray-400">{activity.timestamp}</span>
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
