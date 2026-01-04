// components/dashboard/projects/detail/ProjectOverview.tsx - Tab de resumen del proyecto
"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Wallet,
  ChevronRight
} from "lucide-react";
import type { ProjectWithStats, ProjectMemberWithDetails, IncidentWithDetails } from "@/lib/mock/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface ProjectOverviewProps {
  project: ProjectWithStats;
  members: ProjectMemberWithDetails[];
  incidents: IncidentWithDetails[];
}

const roleLabels = {
  SUPERINTENDENT: "Superintendente",
  RESIDENT: "Residente",
  CABO: "Cabo",
};

export function ProjectOverview({ project, members, incidents }: ProjectOverviewProps) {
  const formatCurrency = (amount?: number) => {
    if (!amount) return "—";
    // Use consistent formatting to prevent SSR/client hydration mismatch
    // Always use 0 fraction digits for compact notation
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      notation: "compact",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const recentIncidents = incidents.slice(0, 5);

  // Calcular días restantes - client-side only to prevent hydration mismatch
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  
  useEffect(() => {
    const today = new Date();
    const endDate = new Date(project.endDate);
    setDaysRemaining(Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  }, [project.endDate]);

  // KPIs con diseño mejorado
  const kpis = [
    {
      label: "Avance General",
      value: `${project.progress}%`,
      icon: TrendingUp,
      iconColor: "text-info",
      iconBg: "bg-info/10",
    },
    {
      label: "Miembros",
      value: project.membersCount,
      icon: Users,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      label: "Inc. Abiertas",
      value: project.openIncidents,
      icon: AlertTriangle,
      iconColor: project.openIncidents > 5 ? "text-destructive" : "text-warning",
      iconBg: project.openIncidents > 5 ? "bg-destructive/10" : "bg-warning/10",
    },
    {
      label: "Inc. Cerradas",
      value: project.totalIncidents - project.openIncidents,
      icon: CheckCircle2,
      iconColor: "text-success",
      iconBg: "bg-success/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs Grid - Diseño mejorado como la propuesta */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="rounded-2xl border-border hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl ${kpi.iconBg}`}>
                      <Icon className={`h-6 w-6 ${kpi.iconColor}`} />
                    </div>
                    <div className="space-y-1">
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="text-3xl font-bold text-foreground"
                      >
                        {kpi.value}
                      </motion.p>
                      <p className="text-sm text-muted-foreground">{kpi.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Progreso y Presupuesto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Barra de progreso grande */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avance del Proyecto
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-4xl font-bold text-foreground"
                    >
                      {project.progress}
                    </motion.span>
                    <span className="text-2xl font-bold text-muted-foreground">%</span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {daysRemaining === null ? (
                        <span>Calculando...</span>
                      ) : daysRemaining > 0 ? (
                        <span>{daysRemaining} días restantes</span>
                      ) : (
                        <span className="text-destructive">Vencido</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <Progress 
                  value={project.progress} 
                  className="h-4 bg-muted"
                  indicatorClassName="bg-primary"
                />

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Inicio: {new Date(project.startDate).toLocaleDateString("es-MX", { month: "short", year: "2-digit" })}</span>
                  <span>Fin: {new Date(project.endDate).toLocaleDateString("es-MX", { month: "short", year: "2-digit" })}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Presupuesto */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Presupuesto
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {project.budget ? (
                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Ejercido</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrency(project.budgetSpent)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-lg font-semibold text-muted-foreground">
                        {formatCurrency(project.budget)}
                      </p>
                    </div>
                  </div>
                  
                  <Progress 
                    value={Math.min(((project.budgetSpent || 0) / project.budget) * 100, 100)} 
                    className="h-3 bg-muted"
                    indicatorClassName={
                      (project.budgetSpent || 0) / project.budget > 0.9 
                        ? "bg-destructive" 
                        : "bg-success"
                    }
                  />
                  
                  <p className="text-xs text-muted-foreground">
                    {Math.round(((project.budgetSpent || 0) / project.budget) * 100)}% del presupuesto utilizado
                  </p>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <Wallet className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Sin presupuesto asignado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Equipo e Incidencias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Equipo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Equipo Asignado
                </CardTitle>
                <a 
                  href="#"
                  className="text-xs text-primary hover:text-primary/80 flex items-center"
                >
                  Ver todos <ChevronRight className="h-3 w-3" />
                </a>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {members.slice(0, 4).map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.5 + index * 0.05 }}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={member.userAvatar} alt={member.userName} />
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {getInitials(member.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {member.userName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {roleLabels[member.assignedRole]}
                      </p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${
                        member.assignedRole === "SUPERINTENDENT" 
                          ? "bg-primary/10 text-primary border-primary/20"
                          : member.assignedRole === "RESIDENT"
                            ? "bg-info/10 text-info border-info/20"
                            : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {member.assignedRole.charAt(0)}
                    </Badge>
                  </motion.div>
                ))}
                {members.length > 4 && (
                  <div className="text-center pt-2">
                    <span className="text-xs text-muted-foreground">
                      +{members.length - 4} miembros más
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Incidencias recientes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Incidencias Recientes
                </CardTitle>
                <a 
                  href="#"
                  className="text-xs text-primary hover:text-primary/80 flex items-center"
                >
                  Ver todas <ChevronRight className="h-3 w-3" />
                </a>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {recentIncidents.length > 0 ? (
                <div className="space-y-2">
                  {recentIncidents.map((incident, index) => (
                    <motion.div
                      key={incident.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.6 + index * 0.05 }}
                      className="flex items-start gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors"
                    >
                      <div className={`p-1.5 rounded-lg shrink-0 ${
                        incident.priority === "CRITICAL" 
                          ? "bg-destructive/10" 
                          : incident.status === "CLOSED"
                            ? "bg-success/10"
                            : "bg-warning/10"
                      }`}>
                        {incident.status === "CLOSED" ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <AlertTriangle className={`h-4 w-4 ${
                            incident.priority === "CRITICAL" ? "text-destructive" : "text-warning"
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground line-clamp-1">
                          {incident.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(incident.createdAt).toLocaleDateString("es-MX")}
                        </p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`shrink-0 ${
                          incident.status === "OPEN" 
                            ? "bg-warning/10 text-warning border-warning/20"
                            : incident.status === "ASSIGNED"
                              ? "bg-info/10 text-info border-info/20"
                              : "bg-success/10 text-success border-success/20"
                        }`}
                      >
                        {incident.status === "OPEN" ? "Abierta" : incident.status === "ASSIGNED" ? "Asignada" : "Cerrada"}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Sin incidencias registradas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
