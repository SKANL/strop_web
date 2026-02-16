"use client"

import { AlertTriangle, DollarSign, ShieldAlert } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const alerts = [
  {
    id: 1,
    project: "Torre Meriden",
    message: "Personal sin arnés en piso 14",
    time: "Hace 10 min",
    type: "security", // security, financial
    critical: true,
  },
  {
    id: 2,
    project: "Plaza Norte",
    message: "Falta de pago a sindicato",
    time: "Hace 2 horas",
    type: "security",
    critical: true,
  },
   {
    id: 3,
    project: "Torre Meriden",
    message: "Incidencia #504 excede límite de costo ($50,000)",
    time: "Hace 5 horas",
    type: "financial",
    critical: true,
  },
]

export function PanicRoom() {
  return (
    <Card className="h-full flex flex-col border-destructive/50 bg-destructive/5 overflow-hidden">
      <CardHeader className="pb-3 pt-4">
        <CardTitle className="flex items-center gap-2 text-destructive text-base">
            <ShieldAlert className="h-5 w-5" />
            Panic Room
        </CardTitle>
        <CardDescription className="text-xs">Atención Inmediata</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 overflow-auto flex-1 pr-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start gap-3 rounded-md border bg-background/80 p-3 shadow-sm hover:bg-accent cursor-pointer transition-colors"
          >
            {alert.type === 'financial' ? 
                <DollarSign className="mt-px h-4 w-4 text-destructive shrink-0" /> : 
                <AlertTriangle className="mt-px h-4 w-4 text-destructive shrink-0" />
            }
            <div className="space-y-1 overflow-hidden">
              <p className="text-sm font-medium leading-none truncate">
                {alert.project}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {alert.message}
              </p>
               <div className="flex items-center pt-1">
                  <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal border-destructive/40 text-destructive">{alert.time}</Badge>
               </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
