// MiniActivityFeed.tsx - Feed compacto de actividad reciente (3 líneas)
"use client";

import { motion } from "motion/react";
import type { ActivityUI } from "@/lib/mock";

interface MiniActivityFeedProps {
  activities: ActivityUI[];
  maxItems?: number;
}

const typeIcons: Record<string, string> = {
  incident: "🔴",
  project: "📁",
  user: "👤",
  system: "⚙️",
};

// Helper para formatear tiempo relativo
function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  return `${diffDays}d`;
}

export function MiniActivityFeed({ activities, maxItems = 3 }: MiniActivityFeedProps) {
  const recentActivities = activities.slice(0, maxItems);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="max-w-md mx-auto pt-6 border-t border-border/50"
    >
      <div className="space-y-2">
        {recentActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.6 + (index * 0.1) }}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <span>{typeIcons[activity.type] || "○"}</span>
            <span className="truncate flex-1">{activity.user} {activity.action} {activity.target}</span>
            <span className="text-muted-foreground/60 shrink-0">{formatTimeAgo(activity.timestamp)}</span>
          </motion.div>
        ))}
      </div>
      
      <div className="text-center mt-3">
        <a 
          href="/dashboard/bitacora" 
          className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
        >
          Ver bitácora completa
        </a>
      </div>
    </motion.div>
  );
}
