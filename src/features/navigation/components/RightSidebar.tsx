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
  mockOrganizationUI,
  roleLabels,
} from "@/lib/mock";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, CheckCheck } from "lucide-react";
import { 
  $notifications, 
  $unreadCount, 
  markAsRead, 
  markAllAsRead,
  type NotificationType 
} from "@/lib/stores/notifications";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function RightSidebar() {
  const isExpanded = useStore(isRightSidebarOpen);
  const notifications = useStore($notifications);
  const unreadCount = useStore($unreadCount);
  const firstName = mockCurrentUserUI.name.split(" ")[0];

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'MENTION': return User;
      case 'ASSIGNMENT': return Info; // Or a clipboard icon
      case 'PROJECT_UPDATE': return Building2;
      case 'SYSTEM': return Info;
      default: return Info;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'MENTION': return "bg-purple-100 text-purple-600";
      case 'ASSIGNMENT': return "bg-blue-100 text-blue-600";
      case 'PROJECT_UPDATE': return "bg-emerald-100 text-emerald-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  // Helper date format
  const formatTime = (isoString: string) => {
    try {
      return formatDistanceToNow(new Date(isoString), { addSuffix: true, locale: es });
    } catch (e) {
      return "hace un momento";
    }
  };

  return (
    <TooltipProvider>
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
                  <Tabs defaultValue="all" className="w-full">
                    <div className="flex items-center justify-between mb-3 px-1">
                      <div className="flex items-center gap-2">
                         <Bell className="h-4 w-4 text-gray-400" />
                         <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Notificaciones</span>
                      </div>
                      {unreadCount > 0 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 hover:bg-blue-50 hover:text-blue-600"
                              onClick={() => markAllAsRead()}
                            >
                              <CheckCheck className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Marcar todas como leídas</TooltipContent>
                        </Tooltip>
                      )}
                    </div>

                    <TabsList className="w-full h-9 p-1 bg-gray-100/50 mb-2">
                      <TabsTrigger value="all" className="flex-1 text-xs h-7">Todas</TabsTrigger>
                      <TabsTrigger value="unread" className="flex-1 text-xs h-7">
                        No leídas
                        {unreadCount > 0 && (
                           <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-[9px] font-bold text-blue-600">
                             {unreadCount}
                           </span>
                        )}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-0">
                      <ScrollArea className="h-48 pr-3">
                        <div className="space-y-2">
                          {notifications.length > 0 ? (
                            notifications.map((notification) => {
                              const Icon = getNotificationIcon(notification.type);
                              return (
                                <div
                                  key={notification.id}
                                  className={`group p-2.5 rounded-lg border transition-all hover:bg-gray-50/80 ${
                                    notification.isRead
                                      ? "bg-white border-gray-100 opacity-60 hover:opacity-100"
                                      : "bg-blue-50/30 border-blue-100"
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div
                                      className={`p-1.5 rounded-md shrink-0 ${getNotificationColor(
                                        notification.type
                                      )}`}
                                    >
                                      <Icon className="h-3.5 w-3.5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2 mb-0.5">
                                        <p className={`text-[11px] leading-tight ${!notification.isRead ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                                          {notification.title}
                                        </p>
                                        {!notification.isRead && (
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-4 w-4 -mt-1 -mr-1 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-blue-600 transition-opacity"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              markAsRead(notification.id);
                                            }}
                                          >
                                            <Check className="h-3 w-3" />
                                          </Button>
                                        )}
                                      </div>
                                      <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">
                                        {notification.message}
                                      </p>
                                      <p className="text-[9px] text-gray-400 mt-1.5">
                                        {formatTime(notification.timestamp)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                              <Bell className="h-8 w-8 mb-2 opacity-20" />
                              <p className="text-xs">Sin notificaciones</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="unread" className="mt-0">
                      <ScrollArea className="h-48 pr-3">
                        <div className="space-y-2">
                          {notifications.some(n => !n.isRead) ? (
                            notifications
                              .filter(n => !n.isRead)
                              .map((notification) => {
                                const Icon = getNotificationIcon(notification.type);
                                return (
                                  <div
                                  key={notification.id}
                                  className="group p-2.5 rounded-lg border bg-blue-50/30 border-blue-100 transition-all hover:bg-gray-50/80"
                                >
                                  <div className="flex items-start gap-3">
                                    <div
                                      className={`p-1.5 rounded-md shrink-0 ${getNotificationColor(
                                        notification.type
                                      )}`}
                                    >
                                      <Icon className="h-3.5 w-3.5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2 mb-0.5">
                                        <p className="text-[11px] leading-tight font-semibold text-gray-900">
                                          {notification.title}
                                        </p>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-4 w-4 -mt-1 -mr-1 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-blue-600 transition-opacity"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              markAsRead(notification.id);
                                            }}
                                          >
                                            <Check className="h-3 w-3" />
                                        </Button>
                                      </div>
                                      <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">
                                        {notification.message}
                                      </p>
                                      <p className="text-[9px] text-gray-400 mt-1.5">
                                        {formatTime(notification.timestamp)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                );
                              })
                          ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                              <CheckCheck className="h-8 w-8 mb-2 opacity-20" />
                              <p className="text-xs">Todo leído</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </div>

                <Separator className="my-2" />

                <div className="flex gap-2 pt-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-9 text-xs rounded-lg"
                    asChild
                  >
                    <a href="/dashboard/configuracion">
                      <Settings className="h-3.5 w-3.5 mr-1.5" />
                      Configuración
                    </a>
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
    </TooltipProvider>
  );
}
