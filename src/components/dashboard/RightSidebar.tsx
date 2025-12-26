// RightSidebar.tsx - Panel lateral derecho con componentes shadcn
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  LogOut, 
  User,
  Building2,
  AlertTriangle,
  Info,
  Settings,
  X
} from "lucide-react";
import { 
  mockCurrentUser, 
  mockNotifications, 
  mockOrganization,
  roleLabels 
} from "@/lib/mock-dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function RightSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const firstName = mockCurrentUser.name.split(" ")[0];
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
        {/* Header - Click para abrir/cerrar */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full flex items-center transition-all shrink-0 cursor-pointer hover:bg-gray-50 border-b border-gray-200 ${
            isExpanded ? "h-16 px-4 justify-between" : "h-16 justify-center"
          }`}
        >
          {/* Avatar con shadcn */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-10 w-10 shrink-0 ring-2 ring-white shadow-md">
                <AvatarImage src={mockCurrentUser.avatarUrl} alt={mockCurrentUser.name} />
                <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
                  {getInitials(mockCurrentUser.name)}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            {!isExpanded && (
              <TooltipContent side="left">
                <p>{mockCurrentUser.name}</p>
              </TooltipContent>
            )}
          </Tooltip>

          {/* Info usuario (solo expandido) */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 ml-4 mr-2"
              >
                <p className="font-semibold text-gray-900 text-sm">{mockCurrentUser.name}</p>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-blue-50 text-blue-700 border-blue-200">
                  {roleLabels[mockCurrentUser.role]}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botón cerrar (solo expandido) */}
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

        {/* Estado COLAPSADO: Notificaciones debajo del avatar */}
        <AnimatePresence>
          {!isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-3 pb-4 w-full pt-2"
            >
              {/* Separador */}
              <Separator className="w-8" />

              {/* Icono Notificaciones */}
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

        {/* Contenido Expandido */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="flex flex-col px-4 py-3"
            >
              {/* Organización */}
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50/80 border border-gray-100 mb-4">
                <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="text-xs text-gray-600 truncate font-medium">{mockOrganization.name}</span>
                <Badge variant="outline" className="ml-auto text-[9px] px-1.5 py-0 h-4 bg-purple-50 text-purple-700 border-purple-200">
                  {mockOrganization.plan}
                </Badge>
              </div>

              {/* Notificaciones */}
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
                    {mockNotifications.slice(0, 4).map((notification, index) => {
                      const Icon = getNotificationIcon(notification.type);
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-start gap-2.5 p-2.5 rounded-xl cursor-pointer transition-colors ${
                            notification.read 
                              ? "hover:bg-gray-50" 
                              : "bg-blue-50/60 hover:bg-blue-50"
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg shrink-0 ${getNotificationColor(notification.type)}`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs leading-snug ${
                              notification.read ? "text-gray-600" : "text-gray-900 font-semibold"
                            }`}>
                              {notification.message.length > 50 
                                ? notification.message.substring(0, 50) + "..." 
                                : notification.message}
                            </p>
                            <span className="text-[10px] text-gray-400 mt-0.5 block">{notification.time}</span>
                          </div>
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1" />
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </ScrollArea>
                
                <Button 
                  variant="ghost" 
                  className="w-full mt-2.5 h-9 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  asChild
                >
                  <a href="/dashboard/notificaciones">
                    Ver todas las notificaciones
                  </a>
                </Button>
              </div>

              {/* Separador */}
              <Separator className="mb-3" />

              {/* Acciones */}
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 px-3 hover:bg-gray-50"
                  asChild
                >
                  <a href="/dashboard/perfil" onClick={(e) => e.stopPropagation()}>
                    <User className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="text-sm text-gray-700 font-medium">Mi Perfil</span>
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 px-3 hover:bg-gray-50"
                  asChild
                >
                  <a href="/dashboard/configuracion" onClick={(e) => e.stopPropagation()}>
                    <Settings className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="text-sm text-gray-700 font-medium">Configuración</span>
                  </a>
                </Button>
                <Button 
                  variant="ghost"
                  className="w-full justify-start h-10 px-3 hover:bg-red-50 group"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <LogOut className="h-4 w-4 mr-3 text-gray-400 group-hover:text-red-500" />
                  <span className="text-sm text-gray-700 group-hover:text-red-600 font-medium">Cerrar Sesión</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
