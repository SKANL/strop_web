// RightSidebar.tsx - Panel lateral derecho colapsable (estilo consistente con FloatingNav)
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  LogOut, 
  User,
  Building2,
  AlertTriangle,
  Info,
  Clock,
  Settings,
  X
} from "lucide-react";
import { 
  mockCurrentUser, 
  mockNotifications, 
  mockOrganization,
  roleLabels 
} from "@/lib/mock-dashboard";

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
        return "bg-red-500/20 text-red-400";
      case "warning":
        return "bg-amber-500/20 text-amber-400";
      default:
        return "bg-blue-500/20 text-blue-400";
    }
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
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
            {firstName.charAt(0)}
          </div>

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
                <p className="text-xs text-gray-500">{roleLabels[mockCurrentUser.role]}</p>
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
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={16} className="text-gray-400" />
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
              <div className="h-px w-8 bg-gray-300" />

              {/* Icono Notificaciones */}
              <div className="relative">
                <Bell size={24} className="text-gray-600" strokeWidth={2} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-2 h-4 w-4 bg-red-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center shadow-lg">
                    {unreadCount}
                  </span>
                )}
              </div>
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
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 mb-4">
                <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="text-xs text-gray-600 truncate font-medium">{mockOrganization.name}</span>
              </div>

              {/* Notificaciones */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-gray-400" />
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Notificaciones
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                
                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                  {mockNotifications.slice(0, 3).map((notification, index) => {
                    const Icon = getNotificationIcon(notification.type);
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors ${
                          notification.read 
                            ? "hover:bg-gray-50" 
                            : "bg-blue-50/60 hover:bg-blue-50"
                        }`}
                      >
                        <div className={`p-1.5 rounded-md shrink-0 ${getNotificationColor(notification.type)}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-snug ${
                            notification.read ? "text-gray-600" : "text-gray-900 font-semibold"
                          }`}>
                            {notification.message.length > 45 
                              ? notification.message.substring(0, 45) + "..." 
                              : notification.message}
                          </p>
                          <span className="text-[10px] text-gray-400 mt-0.5 block">{notification.time}</span>
                        </div>
                        {!notification.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                
                <a 
                  href="/dashboard/notificaciones"
                  className="block w-full mt-2.5 py-2 text-xs font-semibold text-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Ver todas las notificaciones
                </a>
              </div>

              {/* Separador */}
              <div className="h-px w-full bg-gray-200 mb-3" />

              {/* Acciones */}
              <div className="space-y-1">
                <a
                  href="/dashboard/perfil"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <User className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-700 font-medium">Mi Perfil</span>
                </a>
                <a
                  href="/dashboard/configuracion"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Settings className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-700 font-medium">Configuración</span>
                </a>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors group"
                >
                  <LogOut className="h-4 w-4 text-gray-400 group-hover:text-red-500 shrink-0" />
                  <span className="text-sm text-gray-700 group-hover:text-red-600 font-medium">Cerrar Sesión</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
