// ActivityFeed.tsx - Feed de actividad reciente para el Dashboard
import { motion } from "framer-motion";
import { 
  Activity as ActivityIcon, 
  AlertTriangle, 
  FolderKanban, 
  Users, 
  Settings,
  ChevronRight 
} from "lucide-react";
import type { Activity } from "@/lib/mock-dashboard";

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

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-100">
            <ActivityIcon className="h-5 w-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Actividad Reciente</h3>
        </div>
        <a 
          href="/dashboard/auditoria"
          className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          Ver todo
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 space-y-3 max-h-95 overflow-y-auto">
        {displayActivities.map((activity, index) => {
          const Icon = getActivityIcon(activity.type);
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50/50 transition-colors"
            >
              {/* Icon */}
              <div className={`p-2 rounded-lg shrink-0 ${getActivityColor(activity.type)}`}>
                <Icon className="h-4 w-4" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-0.5">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">{activity.user}</span>
                  <span className="text-gray-500"> {activity.action} </span>
                  <span className="font-medium text-gray-800">{activity.target}</span>
                </p>
                <p className="text-xs text-gray-400">{activity.timestamp}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
