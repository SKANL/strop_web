import { z } from "zod"

export const roleSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }).max(50, {
    message: "El nombre no puede tener más de 50 caracteres.",
  }),
  description: z.string().max(200, {
    message: "La descripción no puede tener más de 200 caracteres.",
  }).optional(),
  archetype: z.string().min(1, "Debes seleccionar un arquetipo."),
  permissions: z.array(z.string()).min(1, {
    message: "Debes seleccionar al menos un permiso.",
  }),
})

export type RoleFormValues = z.infer<typeof roleSchema>

export const updateRoleSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  permissions: z.array(z.string()).optional(),
})
