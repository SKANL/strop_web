import { getProjects, getProjectFinancials } from '@/app/actions/projects'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
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
        <CardContent className="flex flex-col items-center justify-center p-12">
          <p className="text-sm text-muted-foreground mb-4">No projects yet</p>
          <Button>
            <PlusIcon />
            New Project
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Projects</CardTitle>
        <CreateProjectButton />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Budget Health</TableHead>
              <TableHead>Incidents</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => {
              const incidentCount = project.incidents?.[0]?.count || 0
              // Calculate budget health (this will be enhanced with getProjectFinancials)
              const budgetUsed = 0 // Placeholder
              const budgetHealth = budgetUsed > 80 ? 'critical' : budgetUsed > 60 ? 'warning' : 'good'
              
              return (
                <TableRow key={project.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Link href={`/dashboard/projects/${project.id}`} className="font-medium hover:underline">
                      {project.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={budgetUsed} 
                        className="w-24 h-2"
                      />
                      <span className={`text-xs font-medium ${
                        budgetHealth === 'critical' ? 'text-destructive' :
                        budgetHealth === 'warning' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {budgetUsed}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{incidentCount}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(project.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={project.is_active ? 'default' : 'secondary'}>
                      {project.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/projects/${project.id}`}>
                        View
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
