/**
 * Schemas de validación para autenticación
 * Utilizamos Zod para validaciones de frontend con mensajes en español
 */
import { z } from "zod";

// ============================================
// SCHEMAS DE LOGIN
// ============================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Ingresa un correo electrónico válido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ============================================
// SCHEMAS DE REGISTRO - PASO 1: ORGANIZACIÓN
// ============================================

export const companySizeOptions = [
  { value: "1-10", label: "1-10 empleados" },
  { value: "11-50", label: "11-50 empleados" },
  { value: "51-200", label: "51-200 empleados" },
  { value: "201-500", label: "201-500 empleados" },
  { value: "500+", label: "Más de 500 empleados" },
] as const;

export const countryOptions = [
  { value: "MX", label: "México" },
  { value: "US", label: "Estados Unidos" },
  { value: "CO", label: "Colombia" },
  { value: "AR", label: "Argentina" },
  { value: "ES", label: "España" },
  { value: "CL", label: "Chile" },
  { value: "PE", label: "Perú" },
] as const;

export const organizationSchema = z.object({
  organizationName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  subdomain: z
    .string()
    .min(3, "El subdominio debe tener al menos 3 caracteres")
    .max(50, "El subdominio no puede exceder 50 caracteres")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Solo letras minúsculas, números y guiones (no al inicio/final)"
    ),
  companySize: z.string().min(1, "Selecciona el tamaño de tu empresa"),
  country: z.string().min(1, "Selecciona tu país"),
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;

// ============================================
// SCHEMAS DE REGISTRO - PASO 2: USUARIO
// ============================================

export const userSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(100, "El nombre no puede exceder 100 caracteres"),
    email: z
      .string()
      .min(1, "El correo electrónico es requerido")
      .email("Ingresa un correo electrónico válido"),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^\+?[1-9]\d{1,14}$/.test(val.replace(/\s/g, "")),
        "Ingresa un número de teléfono válido"
      ),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[0-9]/, "Debe contener al menos un número")
      .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type UserFormData = z.infer<typeof userSchema>;

// ============================================
// SCHEMAS DE REGISTRO - PASO 3: PLAN
// ============================================

export const planOptions = [
  {
    id: "starter",
    name: "Starter",
    price: "Gratis",
    priceDetail: "Para siempre",
    features: [
      "3 proyectos activos",
      "5 usuarios",
      "1 GB de almacenamiento",
      "Soporte por email",
    ],
    popular: false,
    cta: "Comenzar gratis",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$49",
    priceDetail: "USD/mes",
    features: [
      "Proyectos ilimitados",
      "50 usuarios",
      "50 GB de almacenamiento",
      "Soporte prioritario",
      "Reportes avanzados",
      "API access",
    ],
    popular: true,
    cta: "Elegir Pro",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Contactar",
    priceDetail: "Precio personalizado",
    features: [
      "Todo de Pro",
      "Usuarios ilimitados",
      "Almacenamiento ilimitado",
      "SSO/SAML",
      "SLA 99.9%",
      "Gerente de cuenta dedicado",
    ],
    popular: false,
    cta: "Contactar ventas",
  },
] as const;

export const planSchema = z.object({
  plan: z.enum(["starter", "pro", "enterprise"], {
    required_error: "Selecciona un plan",
  }),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: "Debes aceptar los términos y condiciones",
    }),
});

export type PlanFormData = z.infer<typeof planSchema>;

// ============================================
// SCHEMA COMPLETO DE REGISTRO
// ============================================

export const registerSchema = organizationSchema
  .merge(userSchema.innerType())
  .merge(planSchema);

export type RegisterFormData = z.infer<typeof registerSchema>;

// ============================================
// HELPERS DE VALIDACIÓN
// ============================================

export function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: "Débil", color: "bg-red-500" };
  if (score <= 4) return { score, label: "Media", color: "bg-yellow-500" };
  return { score, label: "Fuerte", color: "bg-green-500" };
}

export function getPasswordRequirements(password: string) {
  return [
    {
      label: "Al menos 8 caracteres",
      met: password.length >= 8,
    },
    {
      label: "Una letra mayúscula",
      met: /[A-Z]/.test(password),
    },
    {
      label: "Un número",
      met: /[0-9]/.test(password),
    },
    {
      label: "Un carácter especial",
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];
}
