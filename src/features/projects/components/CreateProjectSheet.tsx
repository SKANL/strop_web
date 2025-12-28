// components/dashboard/projects/CreateProjectSheet.tsx - Formulario para crear/editar proyecto
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  CalendarIcon, 
  MapPin, 
  Building2, 
  User,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { ProjectWithStats, User as UserType } from "@/lib/mock/types";
import { mockUsers } from "@/lib/mock";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Schema de validación Zod
const projectFormSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  description: z
    .string()
    .max(500, "La descripción no puede exceder 500 caracteres")
    .optional(),
  location: z
    .string()
    .min(5, "La ubicación debe tener al menos 5 caracteres")
    .max(200, "La ubicación no puede exceder 200 caracteres"),
  startDate: z.date({
    required_error: "La fecha de inicio es requerida",
  }),
  endDate: z.date({
    required_error: "La fecha de fin es requerida",
  }),
  ownerId: z.string().min(1, "Debes asignar un superintendente"),
  status: z.enum(["ACTIVE", "PAUSED"]),
}).refine((data) => data.endDate > data.startDate, {
  message: "La fecha de fin debe ser posterior a la fecha de inicio",
  path: ["endDate"],
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface CreateProjectSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProject?: ProjectWithStats | null;
  onSuccess?: (project: ProjectFormValues) => void;
}

export function CreateProjectSheet({
  open,
  onOpenChange,
  editingProject,
  onSuccess,
}: CreateProjectSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const isEditing = !!editingProject;

  // Filtrar solo superintendentes activos
  const superintendents = mockUsers.filter(
    (user) => user.role === "SUPERINTENDENT" && user.isActive
  );

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      startDate: new Date(),
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 meses
      ownerId: "",
      status: "ACTIVE",
    },
  });

  // Cargar datos cuando se edita
  useEffect(() => {
    if (editingProject) {
      form.reset({
        name: editingProject.name,
        description: editingProject.description || "",
        location: editingProject.location,
        startDate: new Date(editingProject.startDate),
        endDate: new Date(editingProject.endDate),
        ownerId: editingProject.ownerId || "",
        status: editingProject.status === "COMPLETED" ? "ACTIVE" : editingProject.status,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        location: "",
        startDate: new Date(),
        endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        ownerId: "",
        status: "ACTIVE",
      });
    }
    setSubmitStatus("idle");
  }, [editingProject, form, open]);

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    
    // Simular llamada al servidor
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Simular éxito
    setIsSubmitting(false);
    setSubmitStatus("success");
    
    // Esperar y cerrar
    setTimeout(() => {
      onSuccess?.(data);
      onOpenChange(false);
      setSubmitStatus("idle");
    }, 1000);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-blue-100">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <SheetTitle className="text-lg">
                  {isEditing ? "Editar Proyecto" : "Nuevo Proyecto"}
                </SheetTitle>
                <SheetDescription>
                  {isEditing 
                    ? "Modifica la información del proyecto"
                    : "Crea un nuevo proyecto de construcción"
                  }
                </SheetDescription>
              </div>
            </div>
          </motion.div>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Sección: Información General */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Información General
              </h3>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Proyecto *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ej: Torre Residencial Norte"
                          className="h-11 rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe brevemente el proyecto..."
                          className="min-h-20 rounded-xl resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Máximo 500 caracteres
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ubicación *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input 
                            placeholder="Ej: Av. Reforma 1500, CDMX"
                            className="h-11 pl-10 rounded-xl"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>

            <Separator />

            {/* Sección: Fechas */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Fechas del Proyecto
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de Inicio *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "h-11 rounded-xl pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd MMM yyyy", { locale: es })
                              ) : (
                                <span>Seleccionar</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de Fin *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "h-11 rounded-xl pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd MMM yyyy", { locale: es })
                              ) : (
                                <span>Seleccionar</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => 
                              date < form.getValues("startDate")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>

            <Separator />

            {/* Sección: Asignación */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Asignación
              </h3>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="ownerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Superintendente Responsable *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-xl">
                            <SelectValue placeholder="Selecciona un superintendente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {superintendents.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                                  {user.fullName.charAt(0)}
                                </div>
                                <span>{user.fullName}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs">
                        El superintendente será el responsable principal del proyecto
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado Inicial</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ACTIVE">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              Activo
                            </div>
                          </SelectItem>
                          <SelectItem value="PAUSED">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-amber-500" />
                              Pausado
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>

            <SheetFooter className="pt-6">
              <div className="flex w-full gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 h-11 rounded-xl"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting || submitStatus === "success"}
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Guardando...
                      </motion.div>
                    ) : submitStatus === "success" ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        ¡Guardado!
                      </motion.div>
                    ) : (
                      <motion.span
                        key="default"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {isEditing ? "Guardar Cambios" : "Crear Proyecto"}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </div>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
