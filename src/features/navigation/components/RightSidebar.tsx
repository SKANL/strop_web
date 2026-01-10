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
  AlertCircle,
  TrendingUp,
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
  $urgentNotifications,
  $urgentCount,
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
  const urgentNotifications = useStore($urgentNotifications);
  const urgentCount = useStore($urgentCount);
  const firstName = mockCurrentUserUI.name.split(" ")[0];

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'MENTION': return User;
      case 'ASSIGNMENT': return Info;
      case 'PROJECT_UPDATE': return Building2;
      case 'CRITICAL': return AlertCircle;
      // DEVIATION eliminado del MVP
      case 'SYSTEM': return Info;
      default: return Info;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'MENTION': return "bg-primary/10 text-primary";
      case 'ASSIGNMENT': return "bg-info/20 text-info";
      case 'PROJECT_UPDATE': return "bg-success/20 text-success";
      case 'CRITICAL': return "bg-destructive/20 text-destructive";
      // DEVIATION eliminado del MVP
      default: return "bg-muted text-muted-foreground";
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
        className="fixed right-6 top-6 z-50 bg-background shadow-2xl shadow-black/5 border border-border/80 overflow-hidden"
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
            className={`w-full flex items-center transition-all shrink-0 cursor-pointer hover:bg-muted/50 border-b border-border ${
              isExpanded ? "h-16 px-4 justify-between" : "h-16 justify-center"
            }`}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-10 w-10 shrink-0 ring-2 ring-background shadow-md">
                  <AvatarImage src={mockCurrentUserUI.avatarUrl} alt={mockCurrentUserUI.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
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
                  <p className="font-semibold text-foreground text-sm">{mockCurrentUserUI.name}</p>
                  <Badge variant="outline" size="sm" className="bg-primary/10 text-primary border-primary/20">
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
                    <X className="h-4 w-4 text-muted-foreground" />
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
                      <Bell size={24} className="text-muted-foreground hover:text-foreground transition-colors" strokeWidth={2} />
                      {unreadCount > 0 && (
                        <Badge size="sm" className="absolute -top-1 -right-2 h-4 w-4 p-0 flex items-center justify-center font-bold bg-destructive text-destructive-foreground border-2 border-background">
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
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-muted/30 border border-border mb-4">
                  <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-xs text-foreground truncate font-medium">{mockOrganizationUI.name}</span>
                  <Badge variant="outline" size="sm" className="ml-auto bg-primary/5 text-primary border-primary/20">
                    {mockOrganizationUI.plan}
                  </Badge>
                </div>

                <div className="mb-4">
                  <Tabs defaultValue="all" className="w-full">
                    <div className="flex items-center justify-between mb-3 px-1">
                      <div className="flex items-center gap-2">
                         <Bell className="h-4 w-4 text-muted-foreground" />
                         <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Notificaciones</span>
                      </div>
                      {unreadCount > 0 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 hover:bg-info/10 hover:text-info"
                              onClick={() => markAllAsRead()}
                            >
                              <CheckCheck className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Marcar todas como leídas</TooltipContent>
                        </Tooltip>
                      )}
                    </div>

                    <TabsList className="w-full h-9 p-1 bg-muted/50 mb-2">
                      <TabsTrigger value="all" className="flex-1 text-xs h-7">Todas</TabsTrigger>
                      <TabsTrigger value="urgent" className="flex-1 text-xs h-7">
                        Urgentes
                        {urgentCount > 0 && (
                           <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive/10 text-xs font-bold text-destructive animate-pulse">
                             {urgentCount}
                           </span>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="unread" className="flex-1 text-xs h-7">
                        No leídas
                        {unreadCount > 0 && (
                           <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-info/10 text-xs font-bold text-info">
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
                                  className={`group p-2.5 rounded-lg border transition-all hover:bg-muted/30 ${
                                    notification.isRead
                                      ? "bg-card border-border opacity-70 hover:opacity-100"
                                      : "bg-info/5 border-info/20"
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
                                        <p className={`text-xs leading-tight ${!notification.isRead ? "font-semibold text-foreground" : "font-medium text-muted-foreground"}`}>
                                          {notification.title}
                                        </p>
                                        {!notification.isRead && (
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-4 w-4 -mt-1 -mr-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-info transition-opacity"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              markAsRead(notification.id);
                                            }}
                                          >
                                            <Check className="h-3 w-3" />
                                          </Button>
                                        )}
                                      </div>
                                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                        {notification.message}
                                      </p>
                                      <p className="text-xs text-muted-foreground/70 mt-1.5">
                                        {formatTime(notification.timestamp)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                              <Bell className="h-8 w-8 mb-2 opacity-20" />
                              <p className="text-xs">Sin notificaciones</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    {/* Urgent Notifications Tab */}
                    <TabsContent value="urgent" className="mt-0">
                      <ScrollArea className="h-48 pr-3">
                        <div className="space-y-2">
                          {urgentNotifications.length > 0 ? (
                            urgentNotifications.map((notification) => {
                              const Icon = getNotificationIcon(notification.type);
                              // DEVIATION eliminado del MVP
                              const isCritical = notification.type === 'CRITICAL';
                              return (
                                <div
                                  key={notification.id}
                                  className={`group p-2.5 rounded-lg border transition-all hover:bg-muted/30 ${
                                    isCritical 
                                      ? "bg-destructive/5 border-destructive/20" 
                                      : "bg-warning/5 border-warning/20"
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
                                        <p className="text-xs leading-tight font-semibold text-foreground">
                                          {notification.title}
                                        </p>
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-4 w-4 -mt-1 -mr-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-info transition-opacity"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            markAsRead(notification.id);
                                          }}
                                        >
                                          <Check className="h-3 w-3" />
                                        </Button>
                                      </div>
                                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                        {notification.message}
                                      </p>
                                      <p className="text-xs text-muted-foreground/70 mt-1.5">
                                        {formatTime(notification.timestamp)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                              <AlertTriangle className="h-8 w-8 mb-2 opacity-20" />
                              <p className="text-xs">Sin alertas urgentes</p>
                              <p className="text-xs text-muted-foreground/70 mt-1">¡Todo en orden!</p>
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
                                  className="group p-2.5 rounded-lg border bg-info/5 border-info/20 transition-all hover:bg-muted/30"
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
                                        <p className="text-xs leading-tight font-semibold text-foreground">
                                          {notification.title}
                                        </p>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-4 w-4 -mt-1 -mr-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-info transition-opacity"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              markAsRead(notification.id);
                                            }}
                                          >
                                            <Check className="h-3 w-3" />
                                        </Button>
                                      </div>
                                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                        {notification.message}
                                      </p>
                                      <p className="text-xs text-muted-foreground/70 mt-1.5">
                                        {formatTime(notification.timestamp)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                );
                              })
                          ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
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
                    className="flex-1 h-9 text-xs rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30"
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
