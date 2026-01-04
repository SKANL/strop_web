/**
 * User edit sheet component
 * Side panel form for editing user details
 */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User as UserIcon,
  Phone,
  CheckCircle2,
  Edit3,
  AlertTriangle,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import type { User, UserRole } from "@/lib/mock/types";
import { roleLabels } from "@/lib/mock/types";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Validation schema
const editUserSchema = z.object({
  fullName: z
    .string()
    .min(3, "Nombre muy corto")
    .max(100, "Nombre muy largo"),
  phone: z
    .string()
    .regex(/^\+?[\d\s-]{10,20}$/, "Formato inválido")
    .optional()
    .or(z.literal("")),
  role: z.enum(["OWNER", "SUPERINTENDENT", "RESIDENT", "CABO"]),
  isActive: z.boolean(),
});

type EditUserFormValues = z.infer<typeof editUserSchema>;

interface UserEditSheetProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (userId: string, values: Partial<User>) => void;
}

export function UserEditSheet({
  user,
  open,
  onOpenChange,
  onSuccess,
}: UserEditSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [roleChangeConfirm, setRoleChangeConfirm] = useState<UserRole | null>(null);

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      role: "RESIDENT",
      isActive: true,
    },
  });

  // Load user data when editing
  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName,
        phone: user.phone || "",
        role: user.role,
        isActive: user.isActive,
      });
    }
    setSubmitStatus("idle");
  }, [user, form, open]);

  const handleRoleChange = (newRole: UserRole) => {
    // If changing from OWNER to another role, show confirmation
    if (user?.role !== newRole && (user?.role === "OWNER" || newRole === "OWNER")) {
      setRoleChangeConfirm(newRole);
    } else {
      form.setValue("role", newRole);
    }
  };

  const confirmRoleChange = () => {
    if (roleChangeConfirm) {
      form.setValue("role", roleChangeConfirm);
      setRoleChangeConfirm(null);
    }
  };

  const onSubmit = async (data: EditUserFormValues) => {
    if (!user) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitStatus("success");

    // Wait and close
    setTimeout(() => {
      onSuccess?.(user.id, {
        fullName: data.fullName,
        phone: data.phone || undefined,
        role: data.role,
        isActive: data.isActive,
      });
      onOpenChange(false);
      setSubmitStatus("idle");
    }, 1000);
  };

  if (!user) return null;

  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-lg w-full p-0 bg-card border-l border-border shadow-2xl flex flex-col h-full">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <SheetHeader className="pb-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Edit3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <SheetTitle className="text-lg">Editar Usuario</SheetTitle>
                  <SheetDescription>
                    Modifica la información del usuario
                  </SheetDescription>
                </div>
              </div>
            </motion.div>
          </SheetHeader>

          {/* User preview */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 mb-6"
          >
            <Avatar className="h-12 w-12 ring-2 ring-white shadow-md">
              <AvatarImage src={user.profilePictureUrl} alt={user.fullName} />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">{user.fullName}</p>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            </div>
          </motion.div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
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
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre completo *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                        <FormLabel>Teléfono</FormLabel>
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

                  {/* Email is read-only */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Email
                    </Label>
                    <Input
                      value={user.email}
                      disabled
                      inputSize="lg"
                      className="bg-muted cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground">
                      El email no puede ser modificado
                    </p>
                  </div>
                </div>
              </motion.div>

              <Separator />

              {/* Role and Status */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Rol y Estado
                </h3>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rol *</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(v) => handleRoleChange(v as UserRole)}
                        >
                          <FormControl>
                            <SelectTrigger size="lg" className="rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="OWNER">
                              <span className="flex items-center gap-2">
                                <span>👑</span> {roleLabels.OWNER}
                              </span>
                            </SelectItem>
                            <SelectItem value="SUPERINTENDENT">
                              <span className="flex items-center gap-2">
                                <span>🏗️</span> {roleLabels.SUPERINTENDENT}
                              </span>
                            </SelectItem>
                            <SelectItem value="RESIDENT">
                              <span className="flex items-center gap-2">
                                <span>📋</span> {roleLabels.RESIDENT}
                              </span>
                            </SelectItem>
                            <SelectItem value="CABO">
                              <span className="flex items-center gap-2">
                                <span>🔧</span> {roleLabels.CABO}
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs">
                          Cambiar el rol afecta los permisos del usuario
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between p-4 rounded-xl border">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Usuario Activo
                            </FormLabel>
                            <FormDescription>
                              Los usuarios inactivos no pueden acceder al
                              sistema
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
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
                          Guardar Cambios
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </div>
              </SheetFooter>
            </form>
          </Form>
          </div>
      </SheetContent>
      </Sheet>

      {/* Role Change Confirmation Dialog */}
      <AlertDialog
        open={!!roleChangeConfirm}
        onOpenChange={() => setRoleChangeConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-warning/10">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <AlertDialogTitle>Confirmar Cambio de Rol</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Estás a punto de cambiar el rol de{" "}
              <span className="font-semibold">{user?.fullName}</span> de{" "}
              <span className="font-semibold">{roleLabels[user?.role || "RESIDENT"]}</span> a{" "}
              <span className="font-semibold">
                {roleLabels[roleChangeConfirm || "RESIDENT"]}
              </span>
              .
              <br />
              <br />
              Esto afectará los permisos y acceso del usuario en el sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRoleChange}
              className="bg-primary hover:bg-primary/90"
            >
              Confirmar Cambio
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
