/**
 * User invite dialog component
 * Modal form for inviting new users to the organization
 */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail,
  User,
  Phone,
  CheckCircle2,
  UserPlus,
  Send,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import type { UserRole, ProjectWithStats } from "@/lib/mock/types";
import { roleLabels } from "@/lib/mock/types";
import { mockProjectsWithStats } from "@/lib/mock";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Validation schema
const inviteUserSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .min(5, "Email muy corto"),
  fullName: z
    .string()
    .min(3, "Nombre muy corto")
    .max(100, "Nombre muy largo"),
  phone: z
    .string()
    .regex(/^\+?[\d\s-]{10,20}$/, "Formato de teléfono inválido")
    .optional()
    .or(z.literal("")),
  role: z.enum(["SUPERINTENDENT", "RESIDENT", "CABO"]),
  projectIds: z.array(z.string()).min(1, "Selecciona al menos un proyecto"),
});

type InviteUserFormValues = z.infer<typeof inviteUserSchema>;

interface UserInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (values: InviteUserFormValues) => void;
}

// Role descriptions for better UX
const roleDescriptions: Record<Exclude<UserRole, "OWNER">, string> = {
  SUPERINTENDENT: "Gestión multi-proyecto y supervisión general",
  RESIDENT: "Administración en sitio y seguimiento de obra",
  CABO: "Operaciones de campo y reporte de incidencias",
};

const roleIcons: Record<Exclude<UserRole, "OWNER">, string> = {
  SUPERINTENDENT: "🏗️",
  RESIDENT: "📋",
  CABO: "🔧",
};

export function UserInviteDialog({
  open,
  onOpenChange,
  onSuccess,
}: UserInviteDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  // Get active projects for assignment
  const activeProjects = mockProjectsWithStats.filter(
    (p) => p.status === "ACTIVE"
  );

  const form = useForm<InviteUserFormValues>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: "",
      fullName: "",
      phone: "",
      role: "RESIDENT",
      projectIds: [],
    },
  });

  const onSubmit = async (data: InviteUserFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitStatus("success");

    // Wait and close
    setTimeout(() => {
      onSuccess?.(data);
      onOpenChange(false);
      setSubmitStatus("idle");
      form.reset();
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent className="sm:max-w-lg max-h-[90vh] p-0 flex flex-col gap-0">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-primary/10">
                <UserPlus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg">
                  Invitar Nuevo Miembro
                </DialogTitle>
                <DialogDescription>
                  Envía una invitación por email para unirse al equipo
                </DialogDescription>
              </div>
            </div>
          </motion.div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information Section */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Información Personal
              </h3>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="usuario@empresa.com"
                            inputSize="lg"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre completo *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Nombre Apellido Apellido"
                            inputSize="lg"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono (opcional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="+52 55 1234 5678"
                            inputSize="lg"
                            className="pl-10"
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

            {/* Role Selection Section */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Rol
              </h3>

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-2"
                      >
                        {(["SUPERINTENDENT", "RESIDENT", "CABO"] as const).map(
                          (role) => (
                            <motion.div
                              key={role}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <Label
                                htmlFor={role}
                                className={cn(
                                  "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                                  field.value === role
                                    ? "border-primary bg-primary/5 shadow-sm"
                                    : "border-border hover:border-border/80 hover:bg-muted/50"
                                )}
                              >
                                <RadioGroupItem value={role} id={role} />
                                <span className="text-xl">{roleIcons[role]}</span>
                                <div className="flex-1">
                                  <p className="font-medium text-foreground">
                                    {roleLabels[role]}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {roleDescriptions[role]}
                                  </p>
                                </div>
                              </Label>
                            </motion.div>
                          )
                        )}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <Separator />

            {/* Project Assignment Section */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Proyectos Asignados
              </h3>

              <FormField
                control={form.control}
                name="projectIds"
                render={({ field }) => (
                  <FormItem>
                    <FormDescription className="mb-3">
                      Selecciona los proyectos a los que tendrá acceso
                    </FormDescription>
                    <div className="space-y-2">
                      {activeProjects.map((project) => (
                        <motion.div
                          key={project.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <Label
                            htmlFor={project.id}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                              field.value?.includes(project.id)
                                ? "border-success bg-success/5"
                                : "border-border hover:border-border/80 hover:bg-muted/50"
                            )}
                          >
                            <Checkbox
                              id={project.id}
                              checked={field.value?.includes(project.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, project.id]);
                                } else {
                                  field.onChange(
                                    field.value?.filter((id) => id !== project.id)
                                  );
                                }
                              }}
                            />
                            <div className="flex-1">
                              <p className="font-medium text-foreground">
                                {project.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {project.location}
                              </p>
                            </div>
                            <span
                              className={cn(
                                "w-2 h-2 rounded-full",
                                project.status === "ACTIVE"
                                  ? "bg-success"
                                  : "bg-warning"
                              )}
                            />
                          </Label>
                        </motion.div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <DialogFooter className="pt-4">
              <div className="flex w-full gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  size="lg"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1 bg-primary hover:bg-primary/90"
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
                        <Spinner className="h-4 w-4" />
                        Enviando...
                      </motion.div>
                    ) : submitStatus === "success" ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        ¡Invitación Enviada!
                      </motion.div>
                    ) : (
                      <motion.span
                        key="default"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        <Send className="h-4 w-4" />
                        Enviar Invitación
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
