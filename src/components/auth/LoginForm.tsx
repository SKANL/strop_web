/**
 * LoginForm.tsx
 * Formulario de inicio de sesión con validación y estados de carga
 * Componente React interactivo (Isla de Astro)
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { loginSchema, type LoginFormData } from "@/lib/auth-schemas";
import { mockLogin, mockOAuthLogin } from "@/lib/mock";

// Iconos inline para evitar dependencias adicionales
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const LoaderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg viewBox="0 0 23 23" className="h-5 w-5">
    <path fill="#f35325" d="M1 1h10v10H1z"/>
    <path fill="#81bc06" d="M12 1h10v10H12z"/>
    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
    <path fill="#ffba08" d="M12 12h10v10H12z"/>
  </svg>
);

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "microsoft" | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const response = await mockLogin(data);

      if (response.success) {
        toast.success(response.message, {
          description: `Bienvenido, ${response.data?.user.fullName}`,
        });
        
        // Simular redirección después de 1.5s
        setTimeout(() => {
          toast.info("Redirigiendo al dashboard...");
          // window.location.href = "/dashboard";
        }, 1500);
      } else {
        // Mostrar errores específicos en los campos
        if (response.errors) {
          Object.entries(response.errors).forEach(([field, message]) => {
            setError(field as keyof LoginFormData, { message });
          });
        }
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "microsoft") => {
    setOauthLoading(provider);
    
    try {
      const response = await mockOAuthLogin(provider);
      
      if (response.success) {
        toast.success(response.message, {
          description: `Bienvenido, ${response.data?.user.fullName}`,
        });
      }
    } catch (error) {
      toast.error(`Error al iniciar sesión con ${provider === "google" ? "Google" : "Microsoft"}`);
    } finally {
      setOauthLoading(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
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
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <CardTitle className="text-2xl font-bold tracking-tight">
              Iniciar sesión
            </CardTitle>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <CardDescription className="text-muted-foreground">
              Ingresa tus credenciales para acceder a tu cuenta
            </CardDescription>
          </motion.div>
        </CardHeader>

        <CardContent className="space-y-4 relative z-10">
          {/* Botones OAuth */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="grid grid-cols-2 gap-3"
          >
            <Button
              variant="outline"
              type="button"
              disabled={oauthLoading !== null || isLoading}
              onClick={() => handleOAuthLogin("google")}
              className="h-11"
            >
              {oauthLoading === "google" ? (
                <LoaderIcon />
              ) : (
                <>
                  <GoogleIcon />
                  <span className="ml-2 hidden sm:inline">Google</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              type="button"
              disabled={oauthLoading !== null || isLoading}
              onClick={() => handleOAuthLogin("microsoft")}
              className="h-11"
            >
              {oauthLoading === "microsoft" ? (
                <LoaderIcon />
              ) : (
                <>
                  <MicrosoftIcon />
                  <span className="ml-2 hidden sm:inline">Microsoft</span>
                </>
              )}
            </Button>
          </motion.div>

          {/* Separador */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="relative"
          >
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                o continúa con email
              </span>
            </div>
          </motion.div>

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Campo Email */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@empresa.com"
                autoComplete="email"
                disabled={isLoading}
                className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </motion.div>

            {/* Campo Contraseña */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <a
                  href="/auth/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isLoading}
                  className={`pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </motion.div>

            {/* Checkbox Remember Me */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex items-center space-x-2"
            >
              <Checkbox id="rememberMe" {...register("rememberMe")} />
              <Label
                htmlFor="rememberMe"
                className="text-sm font-normal text-muted-foreground cursor-pointer"
              >
                Mantener sesión iniciada
              </Label>
            </motion.div>

            {/* Botón Submit */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.45 }}
            >
              <Button
                type="submit"
                className="w-full h-11"
                disabled={isLoading || oauthLoading !== null}
              >
                {isLoading ? (
                  <>
                    <LoaderIcon />
                    <span className="ml-2">Iniciando sesión...</span>
                  </>
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
            </motion.div>
          </form>

          {/* Link a Registro */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="text-center text-sm text-muted-foreground"
          >
            ¿No tienes una cuenta?{" "}
            <a
              href="/auth/register"
              className="font-medium text-primary hover:underline"
            >
              Crear cuenta
            </a>
          </motion.p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
