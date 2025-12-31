/**
 * Timeline cronológico de incidencia
 * Muestra historial inalterable: creación, asignaciones, comentarios, cierre
 */

import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  UserPlus, 
  MessageSquare, 
  CheckCircle2,
  type LucideIcon
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { 
  IncidentWithDetails, 
  CommentWithAuthor 
} from "@/lib/mock/types";

interface TimelineEvent {
  id: string;
  type: "created" | "assigned" | "comment" | "closed";
  timestamp: string;
  userName: string;
  userAvatar?: string;
  content?: string;
  extra?: string;
}

interface IncidentTimelineProps {
  incident: IncidentWithDetails;
  comments: CommentWithAuthor[];
}

const eventConfig: Record<
  TimelineEvent["type"],
  { icon: LucideIcon; color: string; label: string }
> = {
  created: {
    icon: Plus,
    color: "bg-green-500",
    label: "Incidencia creada",
  },
  assigned: {
    icon: UserPlus,
    color: "bg-blue-500",
    label: "Asignación",
  },
  comment: {
    icon: MessageSquare,
    color: "bg-purple-500",
    label: "Comentario",
  },
  closed: {
    icon: CheckCircle2,
    color: "bg-emerald-500",
    label: "Cerrada",
  },
};

const timelineItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
};

const lineVariants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 0.4, ease: "easeInOut" as const },
  },
};

function buildTimelineEvents(
  incident: IncidentWithDetails,
  comments: CommentWithAuthor[]
): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  // Created event
  events.push({
    id: `created-${incident.id}`,
    type: "created",
    timestamp: incident.createdAt,
    userName: incident.createdByName,
    userAvatar: incident.createdByAvatar,
    content: incident.description,
  });

  // Assignment event (if assigned)
  if (incident.assignedTo && incident.assignedToName) {
    events.push({
      id: `assigned-${incident.id}`,
      type: "assigned",
      timestamp: incident.updatedAt, // Approximate
      userName: incident.createdByName, // Who assigned
      userAvatar: incident.createdByAvatar,
      extra: incident.assignedToName,
    });
  }

  // Comments
  comments.forEach((comment) => {
    events.push({
      id: `comment-${comment.id}`,
      type: "comment",
      timestamp: comment.createdAt,
      userName: comment.authorName,
      userAvatar: comment.authorAvatar,
      content: comment.text,
    });
  });

  // Closed event
  if (incident.status === "CLOSED" && incident.closedAt) {
    events.push({
      id: `closed-${incident.id}`,
      type: "closed",
      timestamp: incident.closedAt,
      userName: incident.createdByName, // Simplified, should be closedBy
      userAvatar: incident.createdByAvatar,
      content: incident.closedNotes,
    });
  }

  // Sort by timestamp
  return events.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function IncidentTimeline({ incident, comments }: IncidentTimelineProps) {
  const events = buildTimelineEvents(incident, comments);

  return (
    <div className="relative">
      {/* Vertical line */}
      <motion.div
        variants={lineVariants}
        initial="hidden"
        animate="visible"
        className="absolute left-4 top-0 bottom-0 w-0.5 bg-border origin-top"
      />

      <div className="space-y-6">
        {events.map((event, index) => {
          const config = eventConfig[event.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={event.id}
              variants={timelineItemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              className="relative pl-10"
            >
              {/* Icon circle */}
              <div
                className={`absolute left-0 size-8 rounded-full ${config.color} flex items-center justify-center`}
              >
                <Icon className="size-4 text-white" />
              </div>

              {/* Content */}
              <div className="bg-card border rounded-lg p-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-5">
                      <AvatarImage src={event.userAvatar} />
                      <AvatarFallback className="text-[8px]">
                        {getInitials(event.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{event.userName}</span>
                    <Badge variant="secondary" className="text-[10px] px-1.5">
                      {config.label}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(event.timestamp), "d MMM yyyy, HH:mm", {
                      locale: es,
                    })}
                  </span>
                </div>

                {event.content && (
                  <p className="text-sm text-muted-foreground">{event.content}</p>
                )}

                {event.extra && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Asignado a: </span>
                    <span className="font-medium">{event.extra}</span>
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
