import { getProjects } from '@/app/actions/projects'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CreateProjectButton } from './create-project-button'

export async function ProjectGrid() {
  const { data: projects, error } = await getProjects()

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Error loading projects: {error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!projects || projects.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 gap-4">
          <p className="text-sm text-muted-foreground">Aún no tienes proyectos</p>
          <CreateProjectButton />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Proyectos</CardTitle>
        <CreateProjectButton />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proyecto</TableHead>
              <TableHead>Salud Presupuestal</TableHead>
              <TableHead>Incidencias</TableHead>
              <TableHead>Última Actividad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const incidents = (project.incidents as any[]) || []
              const incidentCount = incidents.length
              const moneyAtRisk = incidents
                .filter((i: any) => i.status === 'OPEN' || i.status === 'IN_REVIEW')
                .reduce((sum: number, i: any) => sum + (i.estimated_cost || 0), 0)
              const budget = (project as any).contingency_budget || 0
              const budgetUsed = budget > 0 ? Math.round((moneyAtRisk / budget) * 100) : 0
              
              return (
                <TableRow key={project.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Link href={`/dashboard/projects/${project.id}`} className="font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
                      {project.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {budget === 0 ? (
                      <span className="text-xs text-muted-foreground italic">Sin presupuesto</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Progress
                          value={Math.min(budgetUsed, 100)}
                          className="w-24 h-2"
                          aria-label={`${budgetUsed}% del presupuesto en riesgo`}
                        />
                        <span className={`text-xs font-medium font-mono ${
                          budgetUsed > 80 ? 'text-destructive' :
                          budgetUsed > 60 ? 'text-yellow-600' :
                          'text-emerald-600'
                        }`}>
                          {budgetUsed}%
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{incidentCount}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(project.updated_at).toLocaleDateString('es-MX')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={project.is_active ? 'default' : 'secondary'}>
                      {project.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/projects/${project.id}`}>
                        Ver
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
