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
    <Card className="col-span-1 border-destructive/50 bg-destructive/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="h-5 w-5" />
            Panic Room
        </CardTitle>
        <CardDescription>Atención Inmediata</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start gap-4 rounded-md border bg-background p-3 shadow-sm"
          >
            {alert.type === 'financial' ? 
                <DollarSign className="mt-px h-5 w-5 text-destructive" /> : 
                <AlertTriangle className="mt-px h-5 w-5 text-destructive" />
            }
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                {alert.project}
              </p>
              <p className="text-sm text-muted-foreground">
                {alert.message}
              </p>
               <div className="flex items-center pt-2">
                  <Badge variant="outline" className="text-xs font-normal border-destructive/40 text-destructive">{alert.time}</Badge>
               </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
