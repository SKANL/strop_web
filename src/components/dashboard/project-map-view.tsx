"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Map, MapMarker, MarkerContent, MarkerPopup, MapControls } from "@/components/ui/map"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import type { MapProject } from "@/app/actions/dashboard"

export function ProjectMapView({ projects = [] }: { projects: MapProject[] }) {
  const router = useRouter()

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>Mapa de Proyectos</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <Map
          center={[-99.1332, 19.4326]}
          zoom={5}
          className="w-full h-full"
        >
          <MapControls 
            position="bottom-right" 
            showZoom 
            showLocate 
            showFullscreen 
          />
          
          {projects.map((project) => {
            const healthPercentage = project.budget.total > 0 ? (project.budget.current / project.budget.total) * 100 : 0
            const isCritical = healthPercentage > 80 || project.incidents.critical > 0
            
            return (
              <MapMarker
                key={project.id}
                longitude={project.coordinates[0]}
                latitude={project.coordinates[1]}
              >
                <MarkerContent>
                  <div className={`
                    h-6 w-6 rounded-full border-2 border-white shadow-lg cursor-pointer
                    transition-transform hover:scale-110
                    ${isCritical ? 'bg-destructive' : 'bg-green-500'}
                  `} />
                </MarkerContent>
                
                <MarkerPopup closeButton>
                  <div className="space-y-3 min-w-[200px]">
                    <div>
                      <h3 className="font-semibold text-sm">{project.name}</h3>
                      <p className="text-xs text-muted-foreground">Fase: {project.phase}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Salud:</span>
                        <span className={`font-mono ${isCritical ? 'text-destructive font-bold' : ''}`}>
                          ${project.budget.current.toLocaleString()} / ${project.budget.total.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Incidencias:</span>
                        <div className="flex gap-2">
                          {project.incidents.critical > 0 && (
                            <span className="text-destructive font-bold">
                              🔴 {project.incidents.critical}
                            </span>
                          )}
                          <span className="text-muted-foreground">
                            ⚪ {project.incidents.open}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={project.status === "Activo" ? "default" : "secondary"} className="text-xs">
                        {project.status}
                      </Badge>
                      <button
                        onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                        className="ml-auto text-xs text-primary hover:underline font-medium"
                      >
                        Ver detalles →
                      </button>
                    </div>
                  </div>
                </MarkerPopup>
              </MapMarker>
            )
          })}
        </Map>
      </CardContent>
    </Card>
  )
}
