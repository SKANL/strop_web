"use client"

import { AlertTriangle, DollarSign, ShieldAlert } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import type { PanicRoomAlert } from "@/app/actions/dashboard"

export function PanicRoom({ alerts = [] }: { alerts: PanicRoomAlert[] }) {
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
        {alerts && alerts.length > 0 ? (
          alerts.map((alert) => (
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
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs">
            <p>No critical alerts</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
