'use server'

import { createIncident, getIncidents, InsertIncidentDTO } from '@/services/incidents-service'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const IncidentSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters'),
  project_id: z.string().uuid('Invalid Project ID'),
  priority: z.enum(['NORMAL', 'URGENT', 'CRITICAL']),
  location_tag: z.string().optional().nullable(),
  estimated_cost: z.number().optional()
})

export async function fetchIncidentsAction(projectId: string, page: number) {
  try {
    const { data, count } = await getIncidents(projectId, page)
    return { success: true, data, count }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createIncidentAction(prevState: any, formData: FormData) {
  const rawData = {
    description: formData.get('description'),
    project_id: formData.get('project_id'),
    priority: formData.get('priority'),
    estimated_cost: formData.get('estimated_cost') ? Number(formData.get('estimated_cost')) : 0,
    location_tag: formData.get('location_tag'),
  }

  const validatedFields = IncidentSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation Error',
    }
  }

  try {
      const result = await createIncident({
        project_id: validatedFields.data.project_id,
        description: validatedFields.data.description,
        priority: validatedFields.data.priority, 
        estimated_cost: validatedFields.data.estimated_cost,
        location_tag: validatedFields.data.location_tag
      })

      revalidatePath('/incidents')
      return { success: true, data: result }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}
