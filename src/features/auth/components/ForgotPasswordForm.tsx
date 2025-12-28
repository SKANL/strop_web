/**
 * ForgotPasswordForm.tsx
 * Formulario para solicitar recuperación de contraseña
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Mail, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { mockForgotPassword } from "@/lib/mock";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Ingresa un correo electrónico válido"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      const response = await mockForgotPassword(data.email);

      if (response.success) {
        setSentEmail(data.email);
        setEmailSent(true);
        toast.success("Correo enviado", {
          description: "Revisa tu bandeja de entrada",
        });
      }
    } catch (error) {
      toast.error("Ocurrió un error. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Card className="border-0 shadow-none lg:border lg:shadow-2xl lg:border-border/20 backdrop-blur-md relative overflow-hidden">
        {/* Luz ambiental superior derecha */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/40 rounded-full blur-3xl pointer-events-none mix-blend-screen" />
        {/* Luz ambiental inferior izquierda */}
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/30 rounded-full blur-3xl pointer-events-none mix-blend-screen" />
        {/* Gradiente sutil de profundidad */}
        <div className="absolute inset-0 rounded-lg bg-linear-to-br from-white/10 via-transparent to-black/5 pointer-events-none" />
        {/* Inset shadow para profundidad interior */}
        <div className="absolute inset-0 rounded-lg shadow-inner shadow-black/5 pointer-events-none" />
        <CardContent className="pt-8 pb-6 relative z-10">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Mail className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Revisa tu correo
              </h2>
              <p className="text-muted-foreground">
                Hemos enviado instrucciones para restablecer tu contraseña a:
              </p>
              <p className="font-medium text-foreground">{sentEmail}</p>
            </div>

            <div className="space-y-3 pt-4">
              <p className="text-sm text-muted-foreground">
                ¿No recibiste el correo? Revisa tu carpeta de spam o{" "}
                <button
                  onClick={() => {
                    setEmailSent(false);
                    setSentEmail("");
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  intenta con otro correo
                </button>
              </p>

              <a
                href="/auth/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a iniciar sesión
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-none lg:border lg:shadow-2xl lg:border-border/20 backdrop-blur-md relative overflow-hidden">
      {/* Luz ambiental superior derecha */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/40 rounded-full blur-3xl pointer-events-none mix-blend-screen" />
      {/* Luz ambiental inferior izquierda */}
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/30 rounded-full blur-3xl pointer-events-none mix-blend-screen" />
      {/* Gradiente sutil de profundidad */}
      <div className="absolute inset-0 rounded-lg bg-linear-to-br from-white/10 via-transparent to-black/5 pointer-events-none" />
      {/* Inset shadow para profundidad interior */}
      <div className="absolute inset-0 rounded-lg shadow-inner shadow-black/5 pointer-events-none" />
      <CardHeader className="space-y-1 pb-4 relative z-10">
        <CardTitle className="text-2xl font-bold tracking-tight">
          ¿Olvidaste tu contraseña?
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Ingresa tu correo electrónico y te enviaremos instrucciones para restablecerla.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@empresa.com"
              autoComplete="email"
              disabled={isLoading}
              className={errors.email ? "border-destructive" : ""}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full h-11" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2">Enviando...</span>
              </>
            ) : (
              "Enviar instrucciones"
            )}
          </Button>
        </form>

        <div className="text-center">
          <a
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a iniciar sesión
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
