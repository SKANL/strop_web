// islands/RightSidebar.tsx - Panel lateral derecho
"use client";

import { useStore } from "@nanostores/react";
import { isRightSidebarOpen, toggleRightSidebar } from "@/store/ui";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  LogOut,
  User,
  Building2,
  AlertTriangle,
  Info,
  Settings,
  X,
} from "lucide-react";
import {
  mockCurrentUserUI,
  mockNotifications,
  mockOrganizationUI,
  roleLabels,
} from "@/lib/mock";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function RightSidebar() {
  const isExpanded = useStore(isRightSidebarOpen);
  const firstName = mockCurrentUserUI.name.split(" ")[0];
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
      case "critical":
        return AlertTriangle;
      default:
        return Info;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-100 text-red-600";
      case "warning":
        return "bg-amber-100 text-amber-600";
      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <motion.div
      layout
      className="fixed right-6 top-6 z-50 bg-white shadow-2xl shadow-black/10 border border-gray-200/80 overflow-hidden"
      style={{
        width: isExpanded ? 340 : 72,
        height: isExpanded ? "auto" : 130,
        borderRadius: isExpanded ? 24 : 36,
      }}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 30,
      }}
    >
      <div className="flex flex-col w-full">
        <div
          onClick={() => toggleRightSidebar()}
          className={`w-full flex items-center transition-all shrink-0 cursor-pointer hover:bg-gray-50 border-b border-gray-200 ${
            isExpanded ? "h-16 px-4 justify-between" : "h-16 justify-center"
          }`}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-10 w-10 shrink-0 ring-2 ring-white shadow-md">
                <AvatarImage src={mockCurrentUserUI.avatarUrl} alt={mockCurrentUserUI.name} />
                <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
                  {getInitials(mockCurrentUserUI.name)}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            {!isExpanded && (
              <TooltipContent side="left">
                <p>{mockCurrentUserUI.name}</p>
              </TooltipContent>
            )}
          </Tooltip>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 ml-4 mr-2"
              >
                <p className="font-semibold text-gray-900 text-sm">{mockCurrentUserUI.name}</p>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-blue-50 text-blue-700 border-blue-200">
                  {roleLabels[mockCurrentUserUI.role]}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <X className="h-4 w-4 text-gray-400" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {!isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-3 pb-4 w-full pt-2"
            >
              <Separator className="w-8" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative cursor-pointer">
                    <Bell size={24} className="text-gray-600" strokeWidth={2} />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px] font-bold bg-red-500 border-2 border-white">
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{unreadCount} notificaciones sin leer</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="flex flex-col px-4 py-3"
            >
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50/80 border border-gray-100 mb-4">
                <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="text-xs text-gray-600 truncate font-medium">{mockOrganizationUI.name}</span>
                <Badge variant="outline" className="ml-auto text-[9px] px-1.5 py-0 h-4 bg-purple-50 text-purple-700 border-purple-200">
                  {mockOrganizationUI.plan}
                </Badge>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-gray-400" />
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Notificaciones
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <Badge className="text-[10px] font-bold bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">
                      {unreadCount} nuevas
                    </Badge>
                  )}
                </div>

                <ScrollArea className="h-44">
                  <div className="space-y-1.5 pr-2">
                    {mockNotifications.slice(0, 4).map((notification) => {
                      const Icon = getNotificationIcon(notification.type);
                      return (
                        <div
                          key={notification.id}
                          className={`p-2 rounded-lg border ${
                            notification.read
                              ? "bg-gray-50 border-gray-100"
                              : "bg-blue-50/50 border-blue-100"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <div
                              className={`p-1.5 rounded shrink-0 ${getNotificationColor(
                                notification.type
                              )}`}
                            >
                              <Icon className="h-3 w-3" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-medium text-gray-900 line-clamp-2">
                                {notification.title}
                              </p>
                              <p className="text-[9px] text-gray-500 mt-0.5">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>

              <Separator className="my-2" />

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-9 text-xs rounded-lg"
                >
                  <Settings className="h-3.5 w-3.5 mr-1.5" />
                  Configuración
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-9 text-xs rounded-lg text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-3.5 w-3.5 mr-1.5" />
                  Salir
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
