/**
 * RegisterForm.tsx
 * Formulario de registro multi-step con 3 pasos:
 * 1. Datos de la organización
 * 2. Datos del usuario administrador
 * 3. Selección de plan
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Check, X, Eye, EyeOff, Star } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import {
  organizationSchema,
  userSchema,
  planSchema,
  companySizeOptions,
  countryOptions,
  planOptions,
  getPasswordRequirements,
  getPasswordStrength,
  type OrganizationFormData,
  type UserFormData,
  type PlanFormData,
  type RegisterFormData,
} from "@/lib/auth-schemas";
import { mockRegister, checkSubdomainAvailability } from "@/lib/mock";

// Tipos para los pasos
type Step = 1 | 2 | 3;

// Componente de indicador de pasos
function StepIndicator({ currentStep }: { currentStep: Step }) {
  const steps = [
    { number: 1, title: "Empresa" },
    { number: 2, title: "Usuario" },
    { number: 3, title: "Plan" },
  ];

  return (
    <div className="flex items-center justify-center mb-4">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                currentStep > step.number
                  ? "bg-primary border-primary text-primary-foreground"
                  : currentStep === step.number
                  ? "border-primary text-primary bg-primary/10"
                  : "border-muted-foreground/30 text-muted-foreground"
              }`}
            >
              {currentStep > step.number ? (
                <Check className="h-5 w-5" />
              ) : (
                <span className="text-sm font-semibold">{step.number}</span>
              )}
            </div>
            <span
              className={`mt-2 text-xs font-medium ${
                currentStep >= step.number
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`mx-2 h-0.5 w-12 sm:w-16 transition-colors ${
                currentStep > step.number
                  ? "bg-primary"
                  : "bg-muted-foreground/30"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================
// PASO 1: ORGANIZACIÓN
// ============================================
function OrganizationStep({
  onNext,
  defaultValues,
}: {
  onNext: (data: OrganizationFormData) => void;
  defaultValues: Partial<OrganizationFormData>;
}) {
  const [subdomainStatus, setSubdomainStatus] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string;
  }>({ checking: false, available: null, message: "" });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues,
  });

  const subdomain = watch("subdomain");

  // Debounce para verificar disponibilidad de subdominio
  useEffect(() => {
    if (!subdomain || subdomain.length < 3) {
      setSubdomainStatus({ checking: false, available: null, message: "" });
      return;
    }

    const timeoutId = setTimeout(async () => {
      setSubdomainStatus({ checking: true, available: null, message: "" });
      const result = await checkSubdomainAvailability(subdomain);
      setSubdomainStatus({
        checking: false,
        available: result.available,
        message: result.message,
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [subdomain]);

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      {/* Nombre de la empresa */}
      <div className="space-y-2">
        <Label htmlFor="organizationName">Nombre de la empresa *</Label>
        <Input
          id="organizationName"
          placeholder="Constructora XYZ S.A. de C.V."
          className={errors.organizationName ? "border-destructive" : ""}
          {...register("organizationName")}
        />
        {errors.organizationName && (
          <p className="text-sm text-destructive">{errors.organizationName.message}</p>
        )}
      </div>

      {/* Subdominio */}
      <div className="space-y-2">
        <Label htmlFor="subdomain">Subdominio para tu workspace *</Label>
        <div className="flex">
          <Input
            id="subdomain"
            placeholder="mi-empresa"
            className={`rounded-r-none ${errors.subdomain ? "border-destructive" : ""}`}
            {...register("subdomain")}
          />
          <div className="flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm text-muted-foreground">
            .strop.app
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {subdomainStatus.checking && (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span className="text-muted-foreground">Verificando...</span>
            </>
          )}
          {!subdomainStatus.checking && subdomainStatus.available === true && (
            <>
              <Check className="h-3 w-3 text-green-500" />
              <span className="text-green-600">{subdomainStatus.message}</span>
            </>
          )}
          {!subdomainStatus.checking && subdomainStatus.available === false && (
            <>
              <X className="h-3 w-3 text-destructive" />
              <span className="text-destructive">{subdomainStatus.message}</span>
            </>
          )}
        </div>
        {errors.subdomain && (
          <p className="text-sm text-destructive">{errors.subdomain.message}</p>
        )}
      </div>

      {/* Tamaño de la empresa */}
      <div className="space-y-2">
        <Label htmlFor="companySize">Tamaño de la empresa *</Label>
        <Select onValueChange={(value) => setValue("companySize", value)} defaultValue={defaultValues.companySize}>
          <SelectTrigger className={errors.companySize ? "border-destructive" : ""}>
            <SelectValue placeholder="Selecciona el tamaño" />
          </SelectTrigger>
          <SelectContent>
            {companySizeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.companySize && (
          <p className="text-sm text-destructive">{errors.companySize.message}</p>
        )}
      </div>

      {/* País */}
      <div className="space-y-2">
        <Label htmlFor="country">País *</Label>
        <Select onValueChange={(value) => setValue("country", value)} defaultValue={defaultValues.country}>
          <SelectTrigger className={errors.country ? "border-destructive" : ""}>
            <SelectValue placeholder="Selecciona tu país" />
          </SelectTrigger>
          <SelectContent>
            {countryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.country && (
          <p className="text-sm text-destructive">{errors.country.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full h-11">
        Continuar
      </Button>
    </form>
  );
}

// ============================================
// PASO 2: USUARIO
// ============================================
function UserStep({
  onNext,
  onBack,
  defaultValues,
}: {
  onNext: (data: UserFormData) => void;
  onBack: () => void;
  defaultValues: Partial<UserFormData>;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues,
  });

  const password = watch("password") || "";
  const passwordRequirements = getPasswordRequirements(password);
  const passwordStrength = getPasswordStrength(password);

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      {/* Nombre completo */}
      <div className="space-y-2">
        <Label htmlFor="fullName">Nombre completo *</Label>
        <Input
          id="fullName"
          placeholder="Juan Pérez García"
          className={errors.fullName ? "border-destructive" : ""}
          {...register("fullName")}
        />
        {errors.fullName && (
          <p className="text-sm text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico *</Label>
        <Input
          id="email"
          type="email"
          placeholder="juan.perez@empresa.com"
          className={errors.email ? "border-destructive" : ""}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Teléfono */}
      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono (opcional)</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+52 55 1234 5678"
          className={errors.phone ? "border-destructive" : ""}
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
      </div>

      {/* Contraseña */}
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña *</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className={`pr-10 ${errors.password ? "border-destructive" : ""}`}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        
        {/* Indicador de fortaleza */}
        {password.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${passwordStrength.color}`}
                  style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {passwordStrength.label}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {passwordRequirements.map((req) => (
                <div key={req.label} className="flex items-center gap-1.5 text-xs">
                  {req.met ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border border-muted-foreground/30" />
                  )}
                  <span className={req.met ? "text-green-600" : "text-muted-foreground"}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      {/* Confirmar contraseña */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            className={`pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Botones */}
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1 h-11">
          Atrás
        </Button>
        <Button type="submit" className="flex-1 h-11">
          Continuar
        </Button>
      </div>
    </form>
  );
}

// ============================================
// PASO 3: PLAN
// ============================================
function PlanStep({
  onSubmit,
  onBack,
  isLoading,
  defaultValues,
}: {
  onSubmit: (data: PlanFormData) => void;
  onBack: () => void;
  isLoading: boolean;
  defaultValues: Partial<PlanFormData>;
}) {
  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      ...defaultValues,
      acceptTerms: false,
    },
  });

  const selectedPlan = watch("plan");
  const acceptTerms = watch("acceptTerms");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Cards de planes */}
      <div className="grid gap-4">
        {planOptions.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setValue("plan", plan.id as "starter" | "pro" | "enterprise")}
            className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all ${
              selectedPlan === plan.id
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border hover:border-muted-foreground/50"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-4 flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                Popular
              </div>
            )}
            
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{plan.name}</h3>
                  {selectedPlan === plan.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-bold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.priceDetail}</span>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {plan.features.slice(0, 4).map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {errors.plan && (
        <p className="text-sm text-destructive">{errors.plan.message}</p>
      )}

      <Separator />

      {/* Términos y condiciones */}
      <div className="flex items-start gap-2">
        <Checkbox
          id="acceptTerms"
          checked={acceptTerms}
          onCheckedChange={(checked) => setValue("acceptTerms", checked as boolean)}
          className="mt-0.5"
        />
        <Label htmlFor="acceptTerms" className="text-sm font-normal text-muted-foreground cursor-pointer">
          Acepto los{" "}
          <a href="/terminos" className="text-primary hover:underline">
            Términos de Servicio
          </a>{" "}
          y la{" "}
          <a href="/privacidad" className="text-primary hover:underline">
            Política de Privacidad
          </a>
        </Label>
      </div>
      {errors.acceptTerms && (
        <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>
      )}

      {/* Info de trial */}
      <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 p-4 text-sm">
        <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
          <Check className="h-4 w-4" />
          <span className="font-medium">14 días de prueba gratis</span>
        </div>
        <p className="mt-1 text-green-600 dark:text-green-500">
          Sin tarjeta de crédito requerida. Cancela cuando quieras.
        </p>
      </div>

      {/* Botones */}
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} disabled={isLoading} className="flex-1 h-11">
          Atrás
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1 h-11">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="ml-2">Creando cuenta...</span>
            </>
          ) : (
            "Crear mi cuenta"
          )}
        </Button>
      </div>
    </form>
  );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function RegisterForm() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<RegisterFormData>>({});

  const handleOrganizationSubmit = (data: OrganizationFormData) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleUserSubmit = (data: UserFormData) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(3);
  };

  const handlePlanSubmit = async (data: PlanFormData) => {
    const completeData = { ...formData, ...data } as RegisterFormData;
    setIsLoading(true);

    try {
      const response = await mockRegister(completeData);

      if (response.success) {
        toast.success("¡Cuenta creada exitosamente!", {
          description: "Revisa tu correo para confirmar tu cuenta.",
        });

        // Simular redirección
        setTimeout(() => {
          toast.info("Redirigiendo al dashboard...");
          // window.location.href = "/dashboard";
        }, 2000);
      } else {
        toast.error(response.message);
        
        // Si el error es en un paso anterior, volver a ese paso
        if (response.errors?.subdomain) {
          setCurrentStep(1);
        } else if (response.errors?.email) {
          setCurrentStep(2);
        }
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const stepTitles = {
    1: { title: "Datos de tu empresa", description: "Configuremos el espacio de trabajo de tu organización" },
    2: { title: "Tu cuenta de administrador", description: "Serás el propietario principal de esta cuenta" },
    3: { title: "Elige tu plan", description: "Selecciona el plan que mejor se adapte a tu empresa" },
  };

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
          {stepTitles[currentStep].title}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {stepTitles[currentStep].description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 relative z-10">
        <StepIndicator currentStep={currentStep} />

        {currentStep === 1 && (
          <OrganizationStep
            onNext={handleOrganizationSubmit}
            defaultValues={formData}
          />
        )}

        {currentStep === 2 && (
          <UserStep
            onNext={handleUserSubmit}
            onBack={() => setCurrentStep(1)}
            defaultValues={formData}
          />
        )}

        {currentStep === 3 && (
          <PlanStep
            onSubmit={handlePlanSubmit}
            onBack={() => setCurrentStep(2)}
            isLoading={isLoading}
            defaultValues={formData}
          />
        )}

        {/* Link a Login */}
        <p className="text-center text-sm text-muted-foreground pt-4">
          ¿Ya tienes una cuenta?{" "}
          <a href="/auth/login" className="font-medium text-primary hover:underline">
            Iniciar sesión
          </a>
        </p>
      </CardContent>
    </Card>
  );
}
