/**
 * Formulario para crear nueva incidencia
 * Solo disponible para D/A en casos excepcionales
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { IncidentTypeIcon } from "./IncidentTypeIcon";
import { Plus, AlertTriangle, Check, ChevronsUpDown } from "lucide-react";
import {
  type IncidentType,
  incidentTypeLabels,
  priorityLabels,
} from "@/lib/mock/types";
import { mockProjects } from "@/lib/mock/projects";
import { mockMaterials } from "@/lib/mock/materials";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Validation schema
const incidentFormSchema = z.object({
  projectId: z.string().min(1, "Selecciona un proyecto"),
  type: z.enum([
    "ORDERS_INSTRUCTIONS",
    "REQUESTS_QUERIES",
    "CERTIFICATIONS",
    "INCIDENT_NOTIFICATIONS",
    "MATERIAL_REQUEST",
  ] as const, {
    required_error: "Selecciona un tipo de incidencia",
  }),
  priority: z.enum(["NORMAL", "CRITICAL"] as const, {
    required_error: "Selecciona la prioridad",
  }),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(1000, "La descripción no puede exceder 1000 caracteres"),
  locationName: z.string().optional(),
  // Material request fields
  materialId: z.string().optional(),
  quantity: z.coerce.number().min(0).optional(),
}).superRefine((data, ctx) => {
  if (data.type === "MATERIAL_REQUEST") {
    if (!data.materialId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecciona un material",
        path: ["materialId"],
      });
    }
    if (!data.quantity || data.quantity <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ingresa una cantidad válida mayor a 0",
        path: ["quantity"],
      });
    }
  }
});

type IncidentFormValues = z.infer<typeof incidentFormSchema>;

interface IncidentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: IncidentFormValues) => void;
}

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      duration: 0.4,
      bounce: 0.1,
    },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2 },
  },
};

const errorShake = {
  x: [0, -8, 8, -8, 8, 0],
  transition: { duration: 0.4 },
};

export function IncidentForm({ open, onOpenChange, onSubmit }: IncidentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentFormSchema),
    defaultValues: {
      projectId: "",
      type: undefined,
      priority: "NORMAL",
      description: "",
      locationName: "",
      materialId: "",
      quantity: 0,
    },
  });

  const handleSubmit = async (data: IncidentFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  // Active projects only
  const activeProjects = mockProjects.filter((p) => p.status === "ACTIVE");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="size-5" />
              Nueva Incidencia
            </DialogTitle>
            <DialogDescription>
              Registra una nueva incidencia manualmente. Normalmente las incidencias se crean desde la app móvil.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
              {/* Project */}
              <motion.div variants={fieldVariants}>
                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Proyecto</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <motion.div animate={fieldState.error ? errorShake : {}}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar proyecto..." />
                            </SelectTrigger>
                          </motion.div>
                        </FormControl>
                        <SelectContent>
                          {activeProjects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Type */}
              <motion.div variants={fieldVariants}>
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Tipo de incidencia</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <motion.div animate={fieldState.error ? errorShake : {}}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tipo..." />
                            </SelectTrigger>
                          </motion.div>
                        </FormControl>
                        <SelectContent>
                          {(Object.keys(incidentTypeLabels) as IncidentType[]).map((type) => (
                            <SelectItem key={type} value={type}>
                              <div className="flex items-center gap-2">
                                <IncidentTypeIcon type={type} size={14} />
                                {incidentTypeLabels[type]}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Material Selection (Conditional) */}
              {form.watch("type") === "MATERIAL_REQUEST" && (
                <motion.div
                  variants={fieldVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4 p-4 border rounded-lg bg-muted mb-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="materialId"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Material</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full justify-between pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? mockMaterials.find(
                                        (m) => m.id === field.value
                                      )?.name
                                    : "Seleccionar material"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0" align="start">
                              <Command>
                                <CommandInput placeholder="Buscar material..." />
                                <CommandList>
                                  <CommandEmpty>No encontrado.</CommandEmpty>
                                  <CommandGroup>
                                    {mockMaterials.map((material) => (
                                      <CommandItem
                                        value={material.name}
                                        key={material.id}
                                        onSelect={() => {
                                          form.setValue("materialId", material.id);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            material.id === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        <div className="flex flex-col">
                                          <span>{material.name}</span>
                                          <span className="text-xs text-muted-foreground">
                                            Disp: {material.plannedQuantity - material.requestedQuantity} {material.unit}
                                          </span>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cantidad Requerida</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="any"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Deviation Warning */}
                  {(() => {
                    const materialId = form.watch("materialId");
                    const quantity = form.watch("quantity") || 0;
                    const material = mockMaterials.find(m => m.id === materialId);
                    
                    if (material && quantity > 0) {
                      const available = material.plannedQuantity - material.requestedQuantity;
                      const willExceed = quantity > available;

                      if (willExceed) {
                        const excess = quantity - available;
                        
                        return (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                          >
                            <Alert variant="destructive">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertTitle>Desviación Detectada</AlertTitle>
                              <AlertDescription>
                                Estás solicitando {quantity} {material.unit}, pero solo hay {available} {material.unit} disponibles.
                                Esto generará una <strong>desviación de {excess} {material.unit}</strong>.
                              </AlertDescription>
                            </Alert>
                          </motion.div>
                        );
                      }
                    }
                    return null;
                  })()}
                </motion.div>
              )}

              {/* Priority */}
              <motion.div variants={fieldVariants}>
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prioridad</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="NORMAL" id="priority-normal" />
                            <Label htmlFor="priority-normal" className="cursor-pointer">
                              {priorityLabels.NORMAL}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="CRITICAL" id="priority-critical" />
                            <Label htmlFor="priority-critical" className="cursor-pointer flex items-center gap-1">
                              <AlertTriangle className="size-3 text-destructive" />
                              {priorityLabels.CRITICAL}
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormDescription>
                        Las incidencias críticas notifican inmediatamente al Dueño/Admin.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Description */}
              <motion.div variants={fieldVariants}>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <motion.div animate={fieldState.error ? errorShake : {}}>
                          <Textarea
                            placeholder="Describe la incidencia con detalle..."
                            rows={4}
                            {...field}
                          />
                        </motion.div>
                      </FormControl>
                      <FormDescription>
                        {field.value.length}/1000 caracteres
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Location */}
              <motion.div variants={fieldVariants}>
                <FormField
                  control={form.control}
                  name="locationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ubicación (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Nivel 3, Zona A, Columna C-15"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            </form>
          </Form>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button 
              onClick={form.handleSubmit(handleSubmit)} 
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Spinner className="size-4" />
                  Creando...
                </>
              ) : (
                "Crear Incidencia"
              )}
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
